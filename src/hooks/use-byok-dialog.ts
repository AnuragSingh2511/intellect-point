import { useSyncExternalStore, useCallback } from 'react'

type Listener = () => void

let isOpen = false
const listeners = new Set<Listener>()

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return isOpen
}

function setOpen(value: boolean) {
  isOpen = value
  listeners.forEach((l) => l())
}

export function openByokDialog() {
  setOpen(true)
}

export function useByokDialog() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const onOpenChange = useCallback((v: boolean) => setOpen(v), [])
  return { open, onOpenChange }
}
