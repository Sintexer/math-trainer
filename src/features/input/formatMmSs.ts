// Formats a non-negative millisecond duration as "M:SS" (e.g. 83000 → "1:23").
// Uses Math.ceil so a live countdown displays "0:01" until the final tick at 0.
export function formatMmSs(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
