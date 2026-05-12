import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

type SlideCardProps = {
  slide: {
    id: string
    order: number
    title: string
    content: string
    notes?: string | null
    imageUrl?: string | null
  }
  isActive?: boolean
  onClick?: () => void
}

export function SlideCard({ slide, isActive, onClick }: SlideCardProps) {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 transition-all ${
        isActive
          ? 'bg-primary/10 ring-2 ring-primary/50'
          : 'bg-card/50 hover:bg-card/80 border border-border/30 hover:border-border/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 flex items-center justify-center size-6 rounded-md text-xs font-semibold ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {slide.order + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-1 mb-2">
            {slide.title}
          </h3>
          <div className="aspect-video rounded-lg overflow-hidden relative bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
            {slide.imageUrl ? (
              <>
                {imageStatus !== 'loaded' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <ImageIcon className="size-5 text-white" />
                    </div>
                    {imageStatus === 'loading' && (
                      <span className="text-xs text-blue-200/70">Loading…</span>
                    )}
                  </div>
                )}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageStatus('loaded')}
                  onError={() => setImageStatus('error')}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ImageIcon className="size-5 text-white" />
                </div>
                <span className="text-xs text-blue-200/70">No image</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {slide.content}
          </p>
        </div>
      </div>
    </button>
  )
}
