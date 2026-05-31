/**
 * Lightweight utility helpers used by all generators.
 */

let _counter = 0

/** Generate a lightweight sequential ID prefixed by the technique. */
export function makeId(techniqueId: string): string {
  return `${techniqueId}-${Date.now()}-${++_counter}`
}

/**
 * Return a random integer in the inclusive range [min, max].
 * Uses Math.random() — suitable for game content (not crypto).
 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Pick a random element from an array.
 * Throws if the array is empty.
 */
export function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pick: empty array')
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Shuffle an array in-place using Fisher-Yates and return it.
 */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
