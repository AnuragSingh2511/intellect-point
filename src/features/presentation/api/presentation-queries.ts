import { createServerFn } from '@tanstack/react-start'

export type Presentation = {
  id: string
  title: string
  status: 'generating' | 'ready' | 'error'
  slideCount: number
  style: string
  tone: string
  layout: string
  createdAt: string
}

export const listPresentations = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Presentation[]> => {
    // TODO: fetch from Prisma
    return []
  },
)
