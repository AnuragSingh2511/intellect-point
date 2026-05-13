import { hasInngestCloudConfig, inngest } from '#/integrations/inngest/client'
import {
  generatePresentation,
  helloWorld,
} from '#/integrations/inngest/functions'
import { createFileRoute } from '@tanstack/react-router'

import { serve } from 'inngest/edge'

const handler = serve({
  client: inngest,
  functions: [helloWorld, generatePresentation],
})

const isCloudConfigured =
  process.env.NODE_ENV !== 'production' || hasInngestCloudConfig()

function missingConfigResponse() {
  return Response.json({
    ok: false,
    configured: false,
    message:
      'Inngest cloud is not configured. Presentation generation falls back to inline execution.',
  })
}

export const Route = createFileRoute('/api/inngest')({
  server: {
    handlers: {
      GET: async ({ request }) =>
        isCloudConfigured ? handler(request) : missingConfigResponse(),
      POST: async ({ request }) =>
        isCloudConfigured ? handler(request) : missingConfigResponse(),
      PUT: async ({ request }) =>
        isCloudConfigured ? handler(request) : missingConfigResponse(),
    },
  },
})
