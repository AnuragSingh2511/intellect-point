import type { Presentation } from '../api/presentation-queries'
import { PresentationCard } from './presentation-card'

type PresentationListSectionProps = {
  presentations: Presentation[]
  isPending: boolean
}

export function PresentationListSection({
  presentations,
  isPending,
}: PresentationListSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Your presentations</h2>
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-card/50 animate-pulse border border-border/30"
            />
          ))}
        </div>
      ) : presentations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No presentations yet. Create one with the form below.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presentations.map((p) => (
            <li key={p.id} className="relative">
              <PresentationCard presentation={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
