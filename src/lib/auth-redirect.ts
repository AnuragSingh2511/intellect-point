/**
 * Ensures a redirect path is internal (prevents open redirect attacks).
 * Returns null if the path is external or invalid.
 */
export function toInternalPath(path: string | undefined): string | null {
  if (!path) return null

  // Reject absolute URLs
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return null
  }

  // Ensure it starts with /
  if (!path.startsWith('/')) {
    return '/' + path
  }

  return path
}
