import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  favorites: string[]
  toggleFavorite: (toolId: string) => void
  recentlyUsed: string[]
  addRecentlyUsed: (toolId: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        })),
      recentlyUsed: [],
      addRecentlyUsed: (toolId) =>
        set((state) => {
          const filtered = state.recentlyUsed.filter((id) => id !== toolId);
          return { recentlyUsed: [toolId, ...filtered].slice(0, 10) };
        }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'toolverse-storage',
      partialize: (state) => ({ favorites: state.favorites, recentlyUsed: state.recentlyUsed }),
    }
  )
)
