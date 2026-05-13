import { generatePresentationSlides } from '#/features/presentation/lib/generation'

import { inngest } from './client'

export const generatePresentation = inngest.createFunction(
  {
    id: 'generate-presentation',
    retries: 2,
    triggers: [{ event: 'presentation/generate' }],
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string }
    return generatePresentationSlides(presentationId, (name, fn) =>
      step.run(name, fn),
    )
  },
)

export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    triggers: [{ event: 'test/hello.world' }],
  },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s')
    return { message: `Hello ${event.data.email}!` }
  },
)
