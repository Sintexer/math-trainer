import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Text } from '@chakra-ui/react'
import { getAllTechniques, getConstellationGraph, getLearningTopicForTechnique } from '@/content'
import { useAppSelector } from '@/app/hooks'
import { selectAllTechniqueProgress } from '@/features/progress'
import { DEFAULT_MASTERY_STARS } from '@/shared/types'
import { ConstellationNode } from './ConstellationNode'

// ── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_W = 1200
const CANVAS_H = 900
const MIN_SCALE = 0.35
const MAX_SCALE = 2.5
/** Pointer movement (px) beyond which a gesture is classified as a pan, not a tap. */
const CLICK_THRESHOLD = 8

// ── Types ─────────────────────────────────────────────────────────────────────

interface PanState {
  isPanning: boolean
  hasMoved: boolean
  dragStartX: number
  dragStartY: number
  dragStartOffsetX: number
  dragStartOffsetY: number
  prevPinchDist: number | null
  /** Mirror of React state — allows handlers to read latest values without deps. */
  offset: { x: number; y: number }
  scale: number
}

/**
 * ConstellationMapScreen — Phase 10.
 *
 * Full-viewport pannable / zoomable map of all 25 technique nodes.
 * Touch events are attached imperatively with `{ passive: false }` so that
 * `e.preventDefault()` suppresses native iOS scroll during pan and pinch.
 *
 * Node click dispatches React Router navigation only when the gesture
 * didn't exceed CLICK_THRESHOLD pixels of movement.
 */
export default function ConstellationMapScreen({ onNavigate }: { onNavigate?: () => void } = {}) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(
    () => !localStorage.getItem('mathsprint-map-visited'),
  )

  const allProgress = useAppSelector(selectAllTechniqueProgress)

  const graph = useMemo(() => getConstellationGraph(), [])
  const techniques = useMemo(() => getAllTechniques(), [])

  const techniqueMap = useMemo(
    () => new Map(techniques.map((t) => [t.id, t])),
    [techniques],
  )
  const nodeMap = useMemo(
    () => new Map(graph.nodes.map((n) => [n.techniqueId, n])),
    [graph.nodes],
  )

  // ── Stable pan/zoom state ref ──────────────────────────────────────────────
  // Handlers read from this ref rather than React state to avoid recreating
  // them on every render while still accessing current values.
  const pan = useRef<PanState>({
    isPanning: false,
    hasMoved: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartOffsetX: 0,
    dragStartOffsetY: 0,
    prevPinchDist: null,
    offset: { x: 0, y: 0 },
    scale: 1,
  })

  // Keep the ref mirror in sync with React state.
  useEffect(() => {
    pan.current.offset = offset
    pan.current.scale = scale
  }, [offset, scale])

  // ── Initial scale/offset: fit the canvas into the container ───────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    // Choose the tighter dimension and leave an 8% gutter on each side.
    const s = Math.min(w / CANVAS_W, h / CANVAS_H) * 0.88
    // Center the scaled canvas in the viewport.
    const ox = (w - CANVAS_W * s) / 2
    const oy = (h - CANVAS_H * s) / 2
    pan.current.offset = { x: ox, y: oy }
    pan.current.scale = s
    setOffset({ x: ox, y: oy })
    setScale(s)
  }, []) // runs once after first paint

  // ── Zoom helper — anchored to a viewport-space pivot point ────────────────
  const applyZoom = useCallback((rawNewScale: number, pivotX: number, pivotY: number) => {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawNewScale))
    const ratio = next / pan.current.scale
    const newOffset = {
      x: pivotX - (pivotX - pan.current.offset.x) * ratio,
      y: pivotY - (pivotY - pan.current.offset.y) * ratio,
    }
    pan.current.scale = next
    pan.current.offset = newOffset
    setScale(next)
    setOffset(newOffset)
  }, [])

  // ── Mouse handlers ────────────────────────────────────────────────────────

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Ignore right-click / middle-click
    if (e.button !== 0) return
    pan.current.isPanning = true
    pan.current.hasMoved = false
    pan.current.dragStartX = e.clientX
    pan.current.dragStartY = e.clientY
    pan.current.dragStartOffsetX = pan.current.offset.x
    pan.current.dragStartOffsetY = pan.current.offset.y
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!pan.current.isPanning) return
    const dx = e.clientX - pan.current.dragStartX
    const dy = e.clientY - pan.current.dragStartY
    if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) {
      pan.current.hasMoved = true
    }
    const newOffset = {
      x: pan.current.dragStartOffsetX + dx,
      y: pan.current.dragStartOffsetY + dy,
    }
    pan.current.offset = newOffset
    setOffset(newOffset)
  }, [])

  const handleMouseUp = useCallback(() => {
    pan.current.isPanning = false
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const rect = containerRef.current!.getBoundingClientRect()
      const pivotX = e.clientX - rect.left
      const pivotY = e.clientY - rect.top
      // Normalise across trackpad (small deltaY) and scroll wheel (large deltaY).
      const delta = e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.001)
      applyZoom(pan.current.scale * (1 - delta), pivotX, pivotY)
    },
    [applyZoom],
  )

  // ── Touch handlers (attached with passive:false for iOS Safari) ────────────

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      pan.current.isPanning = true
      pan.current.hasMoved = false
      pan.current.prevPinchDist = null
      pan.current.dragStartX = e.touches[0].clientX
      pan.current.dragStartY = e.touches[0].clientY
      pan.current.dragStartOffsetX = pan.current.offset.x
      pan.current.dragStartOffsetY = pan.current.offset.y
    } else if (e.touches.length === 2) {
      pan.current.isPanning = false
      // Any two-finger gesture counts as "moved" — never fires as a tap.
      pan.current.hasMoved = true
      pan.current.prevPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 1 && pan.current.isPanning) {
        const dx = e.touches[0].clientX - pan.current.dragStartX
        const dy = e.touches[0].clientY - pan.current.dragStartY
        if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) {
          pan.current.hasMoved = true
        }
        const newOffset = {
          x: pan.current.dragStartOffsetX + dx,
          y: pan.current.dragStartOffsetY + dy,
        }
        pan.current.offset = newOffset
        setOffset(newOffset)
      } else if (e.touches.length === 2 && pan.current.prevPinchDist !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        const ratio = dist / pan.current.prevPinchDist
        const rect = containerRef.current!.getBoundingClientRect()
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
        applyZoom(pan.current.scale * ratio, midX, midY)
        pan.current.prevPinchDist = dist
      }
    },
    [applyZoom],
  )

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) {
      pan.current.isPanning = false
      pan.current.prevPinchDist = null
    } else if (e.touches.length === 1) {
      // One finger remains after a pinch — resume single-finger pan from here.
      pan.current.prevPinchDist = null
      pan.current.isPanning = true
      pan.current.dragStartX = e.touches[0].clientX
      pan.current.dragStartY = e.touches[0].clientY
      pan.current.dragStartOffsetX = pan.current.offset.x
      pan.current.dragStartOffsetY = pan.current.offset.y
    }
  }, [])

  // ── Attach all event listeners imperatively ────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)

    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ])

  // ── Node click — only fires if pointer barely moved ───────────────────────
  const handleNodeClick = useCallback(
    (techniqueId: string) => {
      if (!pan.current.hasMoved) {
        onNavigate?.()
        const topicId = getLearningTopicForTechnique(techniqueId)?.id
        navigate(topicId ? `/topic/${topicId}` : '/')
      }
    },
    [navigate, onNavigate],
  )

  const dismissTooltip = useCallback(() => {
    localStorage.setItem('mathsprint-map-visited', 'true')
    setShowTooltip(false)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box
      ref={containerRef}
      w="full"
      h="100svh"
      overflow="hidden"
      bg="bg.app"
      position="relative"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* ── Transformed canvas ── */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w={`${CANVAS_W}px`}
        h={`${CANVAS_H}px`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* SVG edge layer — pointer-events:none so clicks pass through to nodes */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CANVAS_W,
            height: CANVAS_H,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {graph.edges.map((edge) => {
            const from = nodeMap.get(edge.from)
            const to = nodeMap.get(edge.to)
            if (!from || !to) return null
            const crossTopic =
              techniqueMap.get(edge.from)?.topicId !== techniqueMap.get(edge.to)?.topicId
            return (
              <line
                key={`${edge.from}→${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={crossTopic ? '#94a3b8' : '#cbd5e1'}
                strokeWidth={crossTopic ? 1 : 1.5}
                strokeDasharray={crossTopic ? '5 4' : undefined}
                opacity={0.55}
              />
            )
          })}
        </svg>

        {/* Node layer */}
        {graph.nodes.map((node) => {
          const technique = techniqueMap.get(node.techniqueId)
          if (!technique) return null
          const progress = allProgress[node.techniqueId]
          return (
            <ConstellationNode
              key={node.techniqueId}
              techniqueId={node.techniqueId}
              name={technique.name}
              x={node.x}
              y={node.y}
              stars={progress?.stars ?? DEFAULT_MASTERY_STARS}
              techniqueRead={progress?.techniqueRead ?? false}
              hasAnySessions={(progress?.sessions.length ?? 0) > 0}
              onClick={handleNodeClick}
            />
          )
        })}
      </Box>

      {/* ── First-visit tooltip ── */}
      {showTooltip && (
        <Box
          position="absolute"
          bottom={8}
          left="50%"
          style={{ transform: 'translateX(-50%)' }}
          bg="bg.card"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          px={6}
          py={4}
          boxShadow="lg"
          textAlign="center"
          maxW="300px"
          w="calc(100% - 32px)"
          // Render above the canvas via z-index
          zIndex={10}
        >
          <Text fontWeight="semibold" mb={1}>
            Welcome to Math Trainer
          </Text>
          <Text fontSize="sm" color="text.muted" mb={3}>
            Tap any node to explore a technique. Drag to pan, pinch to zoom.
          </Text>
          <Button
            size="sm"
            w="full"
            onClick={dismissTooltip}
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
          >
            Got it
          </Button>
        </Box>
      )}
    </Box>
  )
}
