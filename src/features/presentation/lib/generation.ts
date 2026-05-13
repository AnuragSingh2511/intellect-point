import { Output, generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

import { prisma } from '#/lib/db'

type StepRunner = <T>(name: string, fn: () => Promise<T>) => Promise<T>

const slideSchema = z.object({
  title: z.string().describe('Slide title'),
  content: z.string().describe('Main content / bullet points for the slide'),
  notes: z.string().optional().describe('Speaker notes'),
  imagePrompt: z
    .string()
    .describe(
      'A concise prompt to generate an illustration for this slide (professional, clean style, no text in image)',
    ),
})

const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
})

function buildImageKitUrl(prompt: string, filename: string): string {
  const baseUrl =
    process.env.IMAGEKIT_BASE_URL?.trim() ?? process.env.IMAGE_KIT_URL?.trim()
  if (!baseUrl)
    throw new Error('IMAGEKIT_BASE_URL or IMAGE_KIT_URL is required')

  const sanitizedPrompt = prompt
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)

  return `${baseUrl}/ik-genimg-prompt-${encodeURIComponent(sanitizedPrompt)}/${filename}.jpg?tr=w-1280,h-720`
}

function fallbackSlide(
  presentation: {
    title: string
    prompt: string
  },
  index: number,
  total: number,
) {
  if (index === 0) {
    return {
      title: presentation.title,
      content: presentation.prompt.slice(0, 280),
      notes: 'Open with the main topic and set context for the audience.',
      imagePrompt: `Professional clean presentation cover for ${presentation.title}`,
    }
  }

  if (index === total - 1) {
    return {
      title: 'Summary',
      content: 'Key takeaway\nNext step\nDiscussion points',
      notes: 'Close with the most important conclusion and invite questions.',
      imagePrompt: `Professional summary illustration for ${presentation.title}`,
    }
  }

  return {
    title: `Key Point ${index}`,
    content: 'Main idea\nSupporting detail\nPractical implication',
    notes: 'Expand this point with examples from the source prompt.',
    imagePrompt: `Professional abstract business illustration for ${presentation.title} key point ${index}`,
  }
}

function normalizeSlides(
  slides: z.infer<typeof slideSchema>[],
  presentation: {
    title: string
    prompt: string
    slideCount: number
  },
) {
  const normalized = slides.slice(0, presentation.slideCount)

  while (normalized.length < presentation.slideCount) {
    normalized.push(
      fallbackSlide(presentation, normalized.length, presentation.slideCount),
    )
  }

  return normalized.map((slide, index) => ({
    title:
      slide.title.trim() ||
      fallbackSlide(presentation, index, presentation.slideCount).title,
    content:
      slide.content.trim() ||
      fallbackSlide(presentation, index, presentation.slideCount).content,
    notes: slide.notes?.trim() || null,
    imagePrompt:
      slide.imagePrompt.trim() ||
      fallbackSlide(presentation, index, presentation.slideCount).imagePrompt,
  }))
}

export async function generatePresentationSlides(
  presentationId: string,
  runStep: StepRunner = (_name, fn) => fn(),
) {
  try {
    const presentation = await runStep('fetch-presentation', async () => {
      const p = await prisma.presentation.findUnique({
        where: { id: presentationId },
      })
      if (!p) throw new Error('Presentation not found')
      return p
    })

    await runStep('mark-generating', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'GENERATING' },
      })
    })

    const generatedSlides = await runStep(
      'generate-slides-content',
      async () => {
        const systemPrompt = `You are an expert presentation designer. Given a user's content/prompt, create a compelling presentation.

Style: ${presentation.style}
Tone: ${presentation.tone}
Layout preference: ${presentation.layout}
Number of slides requested: ${presentation.slideCount}

Guidelines:
- Create exactly ${presentation.slideCount} slides
- First slide should be a title slide
- Last slide should be a summary or call-to-action
- Keep content concise and impactful
- For imagePrompt, describe a professional illustration that complements the slide (no text in images)
`

        const result = await generateText({
          model: google('gemini-2.5-flash'),
          output: Output.object({ schema: slidesResponseSchema }),
          system: systemPrompt,
          prompt: presentation.prompt,
        })

        return normalizeSlides(result.output.slides, presentation)
      },
    )

    await runStep('replace-slides', async () => {
      await prisma.$transaction([
        prisma.slide.deleteMany({
          where: { presentationId },
        }),
        prisma.slide.createMany({
          data: generatedSlides.map((slide, i) => ({
            presentationId,
            order: i,
            title: slide.title,
            content: slide.content,
            notes: slide.notes,
            imagePrompt: slide.imagePrompt,
            imageUrl: buildImageKitUrl(
              slide.imagePrompt,
              `slide-${presentationId}-${i}`,
            ),
          })),
        }),
      ])
    })

    await runStep('mark-completed', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'COMPLETED' },
      })
    })

    return { success: true, slideCount: generatedSlides.length }
  } catch (error) {
    await prisma.presentation
      .update({
        where: { id: presentationId },
        data: { status: 'FAILED' },
      })
      .catch(() => undefined)

    throw error
  }
}
