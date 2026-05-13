import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/lib/db'
import { hasInngestCloudConfig, inngest } from '#/integrations/inngest/client'

import { deriveTitle, requirePresentationUserId } from '../lib/server-helpers'
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from '../types/schemas'

async function enqueuePresentationGeneration(presentationId: string) {
  if (process.env.NODE_ENV === 'production' && !hasInngestCloudConfig()) {
    return false
  }

  await inngest.send({
    name: 'presentation/generate',
    data: { presentationId },
  })

  return true
}

async function generateInline(presentationId: string) {
  const { generatePresentationSlides } = await import('../lib/generation')
  await generatePresentationSlides(presentationId)
}

export const createPresentation = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createPresentationInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requirePresentationUserId()
    const presentation = await prisma.presentation.create({
      data: {
        userId,
        title: deriveTitle(data.prompt),
        prompt: data.prompt,
        slideCount: data.slideCount,
        style: data.style,
        tone: data.tone,
        layout: data.layout,
        status: 'GENERATING',
      },
    })

    try {
      const queued = await enqueuePresentationGeneration(presentation.id)
      if (!queued) await generateInline(presentation.id)
    } catch (e) {
      console.error('Presentation generation failed:', e)
      throw e
    }

    return presentation
  })

export const updatePresentation = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updatePresentationInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requirePresentationUserId()
    const { id, ...patch } = data
    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    })
    if (!existing) throw new Error('Not found')
    return prisma.presentation.update({
      where: { id },
      data: patch,
    })
  })

export const deletePresentation = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requirePresentationUserId()
    const existing = await prisma.presentation.findFirst({
      where: { id: data.id, userId },
    })
    if (!existing) throw new Error('Not found')
    await prisma.presentation.delete({ where: { id: data.id } })
    return { ok: true as const }
  })

export const regeneratePresentation = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requirePresentationUserId()
    const existing = await prisma.presentation.findFirst({
      where: { id: data.id, userId },
    })
    if (!existing) throw new Error('Not found')

    await prisma.presentation.update({
      where: { id: data.id },
      data: { status: 'GENERATING' },
    })

    try {
      const queued = await enqueuePresentationGeneration(data.id)
      if (!queued) await generateInline(data.id)
    } catch (e) {
      console.error('Presentation regeneration failed:', e)
      throw e
    }

    return { ok: true as const }
  })
