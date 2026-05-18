import { createAuthClient } from 'better-auth/react'

const PRODUCTION_ORIGIN = 'https://intellect-point.anurag-singh.dev'

function readEnv(name: string): string | undefined {
  if (typeof process === 'undefined') return undefined
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

function toOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined
  try {
    const withProtocol = value.startsWith('http') ? value : `https://${value}`
    return new URL(withProtocol).origin
  } catch {
    return undefined
  }
}

function getServerAuthBaseURL(): string | undefined {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return (
    toOrigin(readEnv('BETTER_AUTH_URL')) ??
    toOrigin(readEnv('SERVER_URL')) ??
    toOrigin(readEnv('VERCEL_PROJECT_PRODUCTION_URL')) ??
    toOrigin(readEnv('VERCEL_URL')) ??
    (readEnv('NODE_ENV') === 'production' ? PRODUCTION_ORIGIN : undefined)
  )
}

export const authClient = createAuthClient({
  baseURL: getServerAuthBaseURL(),
})
