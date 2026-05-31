// Tiny ID helper used by generators. Randomness for problem content lives
// on the Rng abstraction (see ./rng.ts) — IDs only need to be unique within
// a process, so a counter + Date.now() suffix is fine.

let _counter = 0

export function makeId(techniqueId: string): string {
  return `${techniqueId}-${Date.now()}-${++_counter}`
}
