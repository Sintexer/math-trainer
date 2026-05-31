/**
 * Phase placeholder for routes that are not implemented yet.
 * Avoids duplicating 8 near-identical stub files; replace per-page as the
 * actual screens land.
 */
export default function Placeholder({ name }: { name: string }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{name}</h1>
      <p>Placeholder — coming in a future phase.</p>
    </div>
  )
}
