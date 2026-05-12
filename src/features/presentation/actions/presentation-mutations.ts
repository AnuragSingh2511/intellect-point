import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/lib/db'
import { inngest } from '#/integrations/inngest/client'

import { deriveTitle, requirePresentationUserId } from '../lib/server-helpers'
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from '../types/schemas'
import type {
  CreatePresentationInput,
  PresentationIdInput,
  UpdatePresentationInput,
} from '../types/schemas'

export const createPresentation = createServerFn({
  method: 'POST',
}).handler(async (ctx: any) => {
  const data = ctx.input as CreatePresentationInput
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

  await inngest.send({
    name: 'presentation/generate',
    data: { presentationId: presentation.id },
  })

  return presentation
})

export const updatePresentation = createServerFn({
  method: 'POST',
}).handler(async (ctx: any) => {
  const data = ctx.input as UpdatePresentationInput
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
}).handler(async (ctx: any) => {
  const data = ctx.input as PresentationIdInput
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
}).handler(async (ctx: any) => {
  const data = ctx.input as PresentationIdInput
  const userId = await requirePresentationUserId()
  const existing = await prisma.presentation.findFirst({
    where: { id: data.id, userId },
  })
  if (!existing) throw new Error('Not found')

  await prisma.presentation.update({
    where: { id: data.id },
    data: { status: 'GENERATING' },
  })

  await inngest.send({
    name: 'presentation/generate',
    data: { presentationId: data.id },
  })

  return { ok: true as const }
})
