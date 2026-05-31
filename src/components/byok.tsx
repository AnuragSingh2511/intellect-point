import { useState } from 'react'
import { Key, Loader, Settings, Eye, EyeOff, Cpu } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { useApiKey, useApiKeyMutations } from '#/hooks/use-api-key'
import { useByokDialog } from '#/hooks/use-byok-dialog'
import { toast } from 'sonner'

const GEMINI_MODEL = 'gemini-2.5-flash'

export function BYOK() {
  const { open, onOpenChange } = useByokDialog()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  const { data: apiKeyData, isLoading } = useApiKey()
  const { save, remove } = useApiKeyMutations()

  const isConfigured = apiKeyData?.exists ?? false

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v)
    if (!v) {
      setApiKey('')
      setShowKey(false)
    }
  }

  const handleSave = async () => {
    const trimmed = apiKey.trim()
    if (!trimmed) {
      toast.error('Please enter an API key')
      return
    }
    if (!trimmed.startsWith('AIza')) {
      toast.error('Invalid Gemini API key format', {
        description: 'Key should start with "AIza"',
      })
      return
    }
    try {
      await save.mutateAsync(trimmed)
      setApiKey('')
      toast.success('API key saved successfully')
      handleOpenChange(false)
    } catch (e) {
      toast.error('Failed to save API key', {
        description: e instanceof Error ? e.message : 'Please try again',
      })
    }
  }

  const handleClear = async () => {
    try {
      await remove.mutateAsync()
      setApiKey('')
      toast.success('API key removed')
    } catch {
      toast.error('Failed to remove API key')
    }
  }

  if (isLoading) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={isConfigured ? 'outline' : 'default'}
          size="sm"
          className="gap-2 rounded-xl"
        >
          {isConfigured ? (
            <>
              <Settings className="size-4" />
              <span className="hidden sm:inline">API Key</span>
            </>
          ) : (
            <>
              <Key className="size-4" />
              <span className="hidden sm:inline">Set API Key</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gemini API Configuration</DialogTitle>
          <DialogDescription>
            Configure your API key to generate presentations. Your key is
            encrypted and stored securely.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Model badge */}
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5">
            <Cpu className="size-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="text-sm font-medium font-mono">{GEMINI_MODEL}</p>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          {isConfigured && apiKeyData?.maskedKey && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Current key
                  </p>
                  <p className="font-mono text-sm">{apiKeyData.maskedKey}</p>
                </div>
                <div
                  className="size-2 rounded-full bg-green-500"
                  title="Active"
                />
              </div>
              {apiKeyData.updatedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Updated: {new Date(apiKeyData.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="gemini-key" className="text-sm font-medium">
              {isConfigured ? 'Update API Key' : 'API Key'}
            </label>
            <div className="relative">
              <input
                id="gemini-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {isConfigured && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={remove.isPending}
              className="rounded-xl"
            >
              Remove Key
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim() || save.isPending}
            className="rounded-xl"
          >
            {save.isPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              'Save Key'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
