import { Switch } from '#/components/ui/switch'
import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data } = authClient.useSession()
  console.log(data)
  return (
    <div>
      <Switch />
    </div>
  )
}
