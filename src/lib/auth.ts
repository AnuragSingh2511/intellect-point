import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from './db'

const PRODUCTION_ORIGIN = 'https://intellect-point.anurag-singh.dev'

function readEnv(name: string): string | undefined {
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

function getBaseURL(): string | undefined {
  return (
    toOrigin(readEnv('BETTER_AUTH_URL')) ??
    toOrigin(readEnv('SERVER_URL')) ??
    toOrigin(readEnv('VERCEL_PROJECT_PRODUCTION_URL')) ??
    toOrigin(readEnv('VERCEL_URL')) ??
    (readEnv('NODE_ENV') === 'production' ? PRODUCTION_ORIGIN : undefined)
  )
}

function getTrustedOrigins(): string[] {
  const origins = new Set<string>()
  const configuredBaseURL = getBaseURL()
  if (configuredBaseURL) origins.add(configuredBaseURL)
  origins.add(PRODUCTION_ORIGIN)
  if (readEnv('NODE_ENV') !== 'production') {
    origins.add('http://localhost:3000')
  }
  return Array.from(origins)
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins: getTrustedOrigins(),
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [tanstackStartCookies()],
})
