import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/lib/db'
import type {
  SlideLayout,
  SlideStyle,
  SlideTone,
} from '../constants/presentation-options'

export type Slide = {
  id: string
  order: number
  title: string
  content: string
  notes: string | null
  imageUrl: string | null
  imagePrompt: string | null
}

export type Presentation = {
  id: string
  userId: string
  title: string
  prompt: string
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  slideCount: number
  style: SlideStyle
  tone: SlideTone
  layout: SlideLayout
  createdAt: string
  updatedAt: string
  slides: Slide[]
}

export const listPresentations = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Presentation[]> => {
    const rows = await prisma.presentation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return rows as unknown as Presentation[]
  },
)

export const getPresentation = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    if (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof (data as Record<string, unknown>).id === 'string'
    ) {
      return { id: (data as Record<string, unknown>).id as string }
    }
    throw new Error('Missing id')
  })
  .handler(async ({ data }): Promise<Presentation> => {
    const row = await prisma.presentation.findUnique({
      where: { id: data.id },
      include: { slides: { orderBy: { order: 'asc' } } },
    })
    if (!row) throw new Error('Presentation not found')
    return row as unknown as Presentation
  })
