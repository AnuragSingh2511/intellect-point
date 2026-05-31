import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getApiKey,
  saveApiKey,
  deleteApiKey,
} from '#/features/presentation/actions/api-key'

export function useApiKey() {
  return useQuery({
    queryKey: ['gemini-api-key'],
    queryFn: () => getApiKey(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useApiKeyMutations() {
  const queryClient = useQueryClient()

  const save = useMutation({
    mutationFn: (apiKey: string) => saveApiKey({ data: { apiKey } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['gemini-api-key'] }),
  })

  const remove = useMutation({
    mutationFn: () => deleteApiKey(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['gemini-api-key'] }),
  })

  return { save, remove }
}
