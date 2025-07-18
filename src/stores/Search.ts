import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SearchState {
  query: string
  setQuery: (q: string) => void
  clearQuery: () => void
}

export const useSearchStore = create<SearchState>()(
  immer(set => ({
    query: '',
    setQuery: q =>
      set(draft => {
        draft.query = q
      }),
    clearQuery: () =>
      set(draft => {
        draft.query = ''
      }),
  }))
)
