// Pseudo-random number generator abstraction.
//
// All generators receive an `Rng` so they can be driven deterministically
// (seeded Daily Challenge, reproducible tests) or with Math.random() in
// regular drill / challenge sessions.

export interface Rng {
  /** Return a random integer in the inclusive range [min, max]. */
  int(min: number, max: number): number
  /** Pick a random element from a non-empty array. */
  pick<T>(arr: readonly T[]): T
  /** Shuffle an array in place (Fisher–Yates) and return it. */
  shuffle<T>(arr: T[]): T[]
}

/** Build an Rng from a raw `() => number` returning floats in [0, 1). */
function rngFromRandom(random: () => number): Rng {
  return {
    int(min, max) {
      return Math.floor(random() * (max - min + 1)) + min
    },
    pick(arr) {
      if (arr.length === 0) throw new Error('Rng.pick: empty array')
      return arr[Math.floor(random() * arr.length)]
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    },
  }
}

/** The default Math.random()-backed RNG used by all production sessions. */
export const defaultRng: Rng = rngFromRandom(Math.random)

/** Deterministic 32-bit seeded RNG (mulberry32). Use for the Daily Challenge. */
export function createSeededRng(seed: number): Rng {
  let a = seed >>> 0
  return rngFromRandom(() => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  })
}

/**
 * Convert a YYYY-MM-DD date string into a 32-bit seed.
 * Stable across timezones and across processes — the Daily Challenge
 * uses this to ensure every user sees the same problem set for a given date.
 */
export function seedFromDate(isoDate: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < isoDate.length; i++) {
    h ^= isoDate.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
