import type { Presentation } from '#/features/presentation/api/presentation-queries'

interface PresentationListSectionProps {
  presentations: Presentation[]
  isPending: boolean
}

export function PresentationListSection({
  presentations,
  isPending,
}: PresentationListSectionProps) {
  if (isPending) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (presentations.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Presentations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presentations.map((p) => (
          <div
            key={p.id}
            className="glass rounded-2xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {p.status} · {p.slideCount} slides
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
