import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IUserAuth {
  id: string
  name: string
  email: string
}

interface IAuthStore {
  isLogin: boolean
  accessToken: string | null
  hydrated: boolean
  user: IUserAuth | null
  setHydrated: () => void
  login: (token: string | null) => void
  setUser: (user: IUserAuth | null) => void
  logout: () => void
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer(set => ({
      isLogin: false,
      hydrated: false,
      accessToken: null,
      user: null,
      setHydrated() {
        set({ hydrated: true })
      },
      login: token =>
        set(draft => {
          draft.isLogin = true
          draft.accessToken = token
        }),
      setUser: user =>
        set(draft => {
          draft.user = user
        }),
      logout: () =>
        set(draft => {
          draft.isLogin = false
          draft.accessToken = null
          draft.user = null
        }),
    })),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.setHydrated()
      },
    }
  )
)

export function useAuthHydrated() {
  return useAuthStore(state => state.hydrated)
}
