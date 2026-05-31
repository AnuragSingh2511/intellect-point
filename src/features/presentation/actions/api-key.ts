import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'
import { prisma } from '#/lib/db'
import { encryptApiKey, decryptApiKey, maskApiKey } from '#/lib/encryption'

async function requireUserId(): Promise<string> {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session?.user.id) throw new Error('Unauthorized')
  return session.user.id
}

export const getApiKey = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireUserId()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { encryptedGeminiKey: true, geminiKeyUpdatedAt: true },
  })

  if (!user?.encryptedGeminiKey) {
    return { exists: false, maskedKey: null, updatedAt: null }
  }

  const decrypted = decryptApiKey(user.encryptedGeminiKey)
  return {
    exists: true,
    maskedKey: maskApiKey(decrypted),
    updatedAt: user.geminiKeyUpdatedAt?.toISOString() ?? null,
  }
})

export const saveApiKey = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const { apiKey } = data as { apiKey: string }
    if (!apiKey || typeof apiKey !== 'string')
      throw new Error('Invalid API key')
    const trimmed = apiKey.trim()
    if (!trimmed.startsWith('AIza'))
      throw new Error('Invalid Gemini API key format')
    return { apiKey: trimmed }
  })
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const encrypted = encryptApiKey(data.apiKey)
    await prisma.user.update({
      where: { id: userId },
      data: { encryptedGeminiKey: encrypted, geminiKeyUpdatedAt: new Date() },
    })
    return { success: true }
  })

export const deleteApiKey = createServerFn({ method: 'POST' }).handler(
  async () => {
    const userId = await requireUserId()
    await prisma.user.update({
      where: { id: userId },
      data: { encryptedGeminiKey: null, geminiKeyUpdatedAt: null },
    })
    return { success: true }
  },
)
