import { afterEach, describe, expect, it } from 'vitest'

import { hasInngestCloudConfig } from './client'

const ORIGINAL_ENV = {
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
}

afterEach(() => {
  process.env.INNGEST_EVENT_KEY = ORIGINAL_ENV.INNGEST_EVENT_KEY
  process.env.INNGEST_SIGNING_KEY = ORIGINAL_ENV.INNGEST_SIGNING_KEY
})

describe('hasInngestCloudConfig', () => {
  it('requires both cloud event and signing keys', () => {
    delete process.env.INNGEST_EVENT_KEY
    delete process.env.INNGEST_SIGNING_KEY

    expect(hasInngestCloudConfig()).toBe(false)

    process.env.INNGEST_EVENT_KEY = 'event-key'
    expect(hasInngestCloudConfig()).toBe(false)

    process.env.INNGEST_SIGNING_KEY = 'signing-key'
    expect(hasInngestCloudConfig()).toBe(true)
  })
})
