import { getPresentation } from '#/features/presentation/api/presentation-queries'
import { Button } from '#/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/presentations/$presentationId')({
  component: PresentationPage,
})

function PresentationPage() {
  const { presentationId } = Route.useParams()
  const [currentIndex, setCurrentIndex] = useState(0)

  const {
    data: presentation,
    isPending,
    error,
  } = useQuery({
    queryKey: ['presentations', 'detail', presentationId],
    queryFn: () => getPresentation({ data: { id: presentationId } }),
  })

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (error || !presentation) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Presentation not found'}
        </p>
      </main>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const slides = presentation.slides ?? []
  const currentSlide = slides[currentIndex]

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{presentation.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {presentation.status} · {presentation.slideCount} slides ·{' '}
              {presentation.style}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              presentation.status === 'COMPLETED'
                ? 'bg-green-500/10 text-green-400'
                : presentation.status === 'GENERATING'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {presentation.status}
          </div>
        </div>

        {/* Slide viewer */}
        {presentation.status === 'GENERATING' && slides.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center space-y-4">
            <Loader2 className="size-10 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Generating your presentation…</p>
            <p className="text-sm text-muted-foreground">
              This may take a minute. Slides will appear automatically.
            </p>
          </div>
        ) : slides.length > 0 ? (
          <>
            {/* Current slide */}
            <div className="glass rounded-3xl p-8 md:p-12 min-h-105 flex flex-col justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Slide {currentIndex + 1} of {slides.length}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {currentSlide.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  {currentSlide.content.split('\n').map((line, i) => (
                    <p
                      key={i}
                      className="text-lg leading-relaxed text-foreground/90"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {currentSlide.imageUrl && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-border/50">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.imagePrompt ?? 'Slide illustration'}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`size-2 rounded-full transition-all ${
                      i === currentIndex
                        ? 'bg-primary w-5'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))
                }
                disabled={currentIndex === slides.length - 1}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 w-32 text-left p-3 rounded-xl border transition-all ${
                    i === currentIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/30'
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground mb-1">
                    {i + 1}
                  </p>
                  <p className="text-xs font-medium line-clamp-2">
                    {slide.title}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-muted-foreground">No slides available yet.</p>
          </div>
        )}
      </div>
    </main>
  )
}
