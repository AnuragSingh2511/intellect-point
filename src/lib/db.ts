import { PrismaClient } from '#/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL?.trim()

if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

const pool = new Pool({
  connectionString,
})

const adapter = new PrismaPg(pool)

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
