import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import Footer from '../components/Footer'
// import Header from '../components/Header'

// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '#/components/ui/sonner'
import Navbar from '#/components/navbar'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Intellect-Point',
      },
      {
        name: 'description',
        content:
          'AI-powered presentation generator — create beautiful slide decks from a simple text prompt.',
      },
      {
        name: 'theme-color',
        content: '#1a1a2e',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootLayout() {
  return (
    <div className="min-h-svh">
      <Navbar />
      <Outlet />
    </div>
  )
}
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script />
        <HeadContent />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground selection:bg-primary/20"
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
