// Stub Inngest client — wire up to real Inngest when ready
export const inngest = {
  send: async (_event: { name: string; data: Record<string, unknown> }) => {
    console.log('[Inngest stub] event:', _event.name, _event.data)
  },
}
