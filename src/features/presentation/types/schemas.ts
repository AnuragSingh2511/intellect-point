import { z } from 'zod'

export const createPresentationInputSchema = z.object({
  prompt: z.string().min(1),
  slideCount: z.number().int().min(3).max(20),
  style: z.string(),
  tone: z.string(),
  layout: z.string(),
})

export const updatePresentationInputSchema = z.object({
  id: z.string().cuid(),
  title: z.string().optional(),
  prompt: z.string().optional(),
  slideCount: z.number().int().min(3).max(20).optional(),
  style: z.string().optional(),
  tone: z.string().optional(),
  layout: z.string().optional(),
  status: z.enum(['DRAFT', 'GENERATING', 'COMPLETED', 'FAILED']).optional(),
})

export const presentationIdInputSchema = z.object({
  id: z.string().cuid(),
})

export type CreatePresentationInput = z.infer<
  typeof createPresentationInputSchema
>
export type UpdatePresentationInput = z.infer<
  typeof updatePresentationInputSchema
>
export type PresentationIdInput = z.infer<typeof presentationIdInputSchema>
