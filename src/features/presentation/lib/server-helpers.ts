import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

export async function requirePresentationUserId(): Promise<string> {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session?.user.id) throw new Error('Unauthorized')
  return session.user.id
}

export function deriveTitle(prompt: string): string {
  const trimmed = prompt.trim()
  const firstLine = trimmed.split(/[.\n]/)[0]
  const words = firstLine.split(/\s+/).slice(0, 6)
  let title = words.join(' ')
  if (trimmed.length > title.length) title += '…'
  if (title.length > 60) title = title.slice(0, 60) + '…'
  return title || 'Untitled Presentation'
}
