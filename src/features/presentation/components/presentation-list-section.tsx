import { Link } from '@tanstack/react-router'
import type { Presentation } from '../api/presentation-queries'

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
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : presentations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No presentations yet. Create one with the form below.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {presentations.map((p) => (
            <li key={p.id}>
              <Link
                to="/presentations/$presentationId"
                params={{ presentationId: p.id }}
                className="block glass rounded-2xl p-4 hover:border-primary/30 transition-colors"
              >
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {p.status.toLowerCase()} · {p.slideCount} slides
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
