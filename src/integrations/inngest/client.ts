import { Inngest } from 'inngest'

const isDev = process.env.NODE_ENV !== 'production'

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'my-app',
  eventKey: isDev ? 'local' : (process.env.INNGEST_EVENT_KEY ?? ''),
  isDev,
})
