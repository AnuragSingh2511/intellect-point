import { createAuthClient } from 'better-auth/react'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [tanstackStartCookies()],
})
