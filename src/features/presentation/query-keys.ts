export const presentationQueryKeys = {
  all: () => ['presentations'] as const,
  lists: () => [...presentationQueryKeys.all(), 'list'] as const,
  list: () => [...presentationQueryKeys.lists()] as const,
  details: () => [...presentationQueryKeys.all(), 'detail'] as const,
  detail: (id: string) => [...presentationQueryKeys.details(), id] as const,
}
