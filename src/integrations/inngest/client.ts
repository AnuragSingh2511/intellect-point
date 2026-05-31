import { Inngest } from 'inngest'

export function hasInngestCloudConfig() {
  return Boolean(
    process.env.INNGEST_EVENT_KEY?.trim() &&
    process.env.INNGEST_SIGNING_KEY?.trim(),
  )
}

const isCloud = process.env.NODE_ENV === 'production' && hasInngestCloudConfig()

export const inngest = new Inngest({
  id: 'my-app',
  eventKey: isCloud ? process.env.INNGEST_EVENT_KEY : 'local',
  isDev: !isCloud,
})
