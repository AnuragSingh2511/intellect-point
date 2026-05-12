// import { ThemeToggle } from '#/components/theme-toggle'
// import ThemeToggle from '#/components/ThemeToggle'
// import { authClient } from '#/lib/auth-client'
import { getSession } from '#/lib/auth.function'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    // TODO: Add authentication check here
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    return { user: session.user }
  },
  component: App,
})

function App() {
  // const { data } = authClient.useSession()
  // console.log(data)

  return (
    <div>
      {/* <ThemeToggle /> */}
      <h1>Hello</h1>
    </div>
  )
}
