import type { ConstellationGraph } from '@/shared/types'

/**
 * Hand-tuned node positions on a 1200 × 900 logical canvas.
 *
 * Layout concept:
 *   - Addition cluster:       top-left
 *   - Subtraction cluster:    bottom-left
 *   - Speed / memory drills:  middle strip (x ≈ 400–490) — foundation nodes
 *   - Multiplication cluster: top-right (largest)
 *   - Division cluster:       bottom-right
 *
 * Coordinates are in logical units (not pixels). The map component
 * scales them to the viewport via a transform.
 */
export const constellationGraph: ConstellationGraph = {
  nodes: [
    // ── Addition (top-left) ──────────────────────────────
    { techniqueId: 'add-left-to-right',   x: 140, y: 120 },
    { techniqueId: 'add-complement-100',  x: 260, y:  80 },
    { techniqueId: 'add-round-adjust',    x: 200, y: 210 },
    { techniqueId: 'add-near-doubles',    x:  90, y: 230 },
    { techniqueId: 'add-column-grouping', x: 310, y: 180 },

    // ── Subtraction (bottom-left) ────────────────────────
    { techniqueId: 'sub-complement-10',   x: 130, y: 420 },
    { techniqueId: 'sub-borrow-free',     x: 250, y: 380 },
    { techniqueId: 'sub-round-adjust',    x: 200, y: 500 },
    { techniqueId: 'sub-counting-up',     x:  90, y: 540 },

    // ── Speed & memory foundation drills (middle strip) ──
    // Addition speed — top of middle strip
    { techniqueId: 'add-speed-1d2d',      x: 400, y: 100 },
    { techniqueId: 'add-speed-2d2d',      x: 420, y: 200 },
    { techniqueId: 'add-speed-3d',        x: 440, y: 305 },
    // Subtraction speed — bottom of middle strip
    { techniqueId: 'sub-speed-2d1d',      x: 400, y: 440 },
    { techniqueId: 'sub-speed-2d2d',      x: 420, y: 540 },
    { techniqueId: 'sub-speed-3d',        x: 440, y: 650 },
    // Multiplication memory — left edge of multiplication cluster
    { techniqueId: 'mul-times-table',     x: 490, y:  90 },
    { techniqueId: 'mul-perfect-squares', x: 490, y: 230 },

    // ── Multiplication (top-right, largest cluster) ──────
    { techniqueId: 'mul-by-11',           x: 640, y:  90 },
    { techniqueId: 'mul-by-9',            x: 760, y: 140 },
    { techniqueId: 'mul-by-5',            x: 680, y: 220 },
    { techniqueId: 'mul-by-25',           x: 820, y: 240 },
    { techniqueId: 'mul-by-12',           x: 580, y: 200 },
    { techniqueId: 'mul-sq-ending-5',     x: 720, y: 340 },
    { techniqueId: 'mul-near-100',        x: 880, y: 160 },
    { techniqueId: 'mul-double-halve',    x: 620, y: 320 },
    { techniqueId: 'mul-by-99-101',       x: 860, y: 300 },
    { techniqueId: 'mul-foil-mental',     x: 780, y: 430 },

    // ── Division (bottom-right) ──────────────────────────
    { techniqueId: 'div-by-5',            x: 640, y: 580 },
    { techniqueId: 'div-by-25',           x: 760, y: 560 },
    { techniqueId: 'div-by-9-digit-sum',  x: 860, y: 620 },
    { techniqueId: 'div-percent-10-5-20', x: 680, y: 680 },
    { techniqueId: 'div-estimate-adjust', x: 820, y: 720 },
    { techniqueId: 'div-factor-decompose',x: 950, y: 660 },
  ],

  edges: [
    // ── Addition internal ────────────────────────────────
    { from: 'add-left-to-right',   to: 'add-round-adjust' },
    { from: 'add-left-to-right',   to: 'add-near-doubles' },
    { from: 'add-round-adjust',    to: 'add-complement-100' },
    { from: 'add-round-adjust',    to: 'add-column-grouping' },

    // ── Subtraction internal ─────────────────────────────
    { from: 'sub-complement-10',   to: 'sub-borrow-free' },
    { from: 'sub-borrow-free',     to: 'sub-round-adjust' },
    { from: 'sub-complement-10',   to: 'sub-counting-up' },

    // ── Multiplication internal ──────────────────────────
    { from: 'mul-by-5',            to: 'mul-by-25' },
    { from: 'mul-by-5',            to: 'mul-double-halve' },
    { from: 'mul-by-9',            to: 'mul-by-99-101' },
    { from: 'mul-by-11',           to: 'mul-by-12' },
    { from: 'mul-by-11',           to: 'mul-by-99-101' },
    { from: 'mul-near-100',        to: 'mul-by-99-101' },
    { from: 'mul-near-100',        to: 'mul-foil-mental' },
    { from: 'mul-sq-ending-5',     to: 'mul-foil-mental' },
    { from: 'mul-double-halve',    to: 'mul-sq-ending-5' },

    // ── Division internal ────────────────────────────────
    { from: 'div-by-5',            to: 'div-by-25' },
    { from: 'div-by-9-digit-sum',  to: 'div-factor-decompose' },
    { from: 'div-estimate-adjust', to: 'div-factor-decompose' },
    { from: 'div-percent-10-5-20', to: 'div-by-25' },

    // ── Speed drill progression chains ───────────────────
    { from: 'add-speed-1d2d',      to: 'add-speed-2d2d' },
    { from: 'add-speed-2d2d',      to: 'add-speed-3d' },
    { from: 'sub-speed-2d1d',      to: 'sub-speed-2d2d' },
    { from: 'sub-speed-2d2d',      to: 'sub-speed-3d' },
    { from: 'mul-times-table',     to: 'mul-perfect-squares' },

    // ── Foundation → trick technique bridges ─────────────
    { from: 'add-speed-2d2d',      to: 'add-left-to-right' },
    { from: 'sub-speed-2d2d',      to: 'sub-complement-10' },
    { from: 'mul-times-table',     to: 'mul-by-9' },
    { from: 'mul-perfect-squares', to: 'mul-sq-ending-5' },

    // ── Cross-topic bridges ──────────────────────────────
    { from: 'add-complement-100',  to: 'sub-complement-10' },
    { from: 'add-round-adjust',    to: 'sub-round-adjust' },
    { from: 'add-near-doubles',    to: 'mul-double-halve' },
    { from: 'mul-by-5',            to: 'div-by-5' },
    { from: 'mul-by-25',           to: 'div-by-25' },
    { from: 'mul-by-9',            to: 'div-by-9-digit-sum' },
    { from: 'div-percent-10-5-20', to: 'mul-by-5' },
    // Inverse-operation bridge: addition ↔ subtraction speed drills
    { from: 'add-speed-3d',        to: 'sub-speed-3d' },
  ],
}
