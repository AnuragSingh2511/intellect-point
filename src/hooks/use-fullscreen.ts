import { useCallback, useEffect, useState } from 'react'

export function useFullscreen(targetElementId: string) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(async () => {
    const elem = document.getElementById(targetElementId)
    if (!elem) {
      console.warn('Fullscreen target not found:', targetElementId)
      return
    }

    try {
      if (document.fullscreenElement === elem) {
        await document.exitFullscreen()
      } else if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await elem.requestFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err)
    }
  }, [targetElementId])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return { isFullscreen, toggleFullscreen }
}
