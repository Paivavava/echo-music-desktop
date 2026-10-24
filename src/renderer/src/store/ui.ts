import { create } from 'zustand'
import type { Song } from '@shared/types'

export type ToastTone = 'default' | 'success' | 'error'

export interface Toast {
  id: number
  text: string
  tone: ToastTone
}

interface UiState {
  toasts: Toast[]
  toast: (text: string, tone?: ToastTone) => void
  dismissToast: (id: number) => void

  nowPlayingOpen: boolean
  nowPlayingTab: 'lyrics' | 'queue'
  openNowPlaying: (tab?: 'lyrics' | 'queue') => void
  closeNowPlaying: () => void
  setNowPlayingTab: (tab: 'lyrics' | 'queue') => void

  playlistPickerSong: Song | null
  openPlaylistPicker: (song: Song) => void
  closePlaylistPicker: () => void

  createPlaylistOpen: boolean
  openCreatePlaylist: () => void
  closeCreatePlaylist: () => void
}

let toastId = 0

export const useUi = create<UiState>((set, get) => ({
  toasts: [],
  toast: (text, tone = 'default') => {
    const id = ++toastId
    set({ toasts: [...get().toasts, { id, text, tone }] })
    setTimeout(() => get().dismissToast(id), 3200)
  },
  dismissToast: (id) =>
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),

  nowPlayingOpen: false,
  nowPlayingTab: 'lyrics',
  openNowPlaying: (tab = 'lyrics') => set({ nowPlayingOpen: true, nowPlayingTab: tab }),
  closeNowPlaying: () => set({ nowPlayingOpen: false }),
  setNowPlayingTab: (tab) => set({ nowPlayingTab: tab }),

  playlistPickerSong: null,
  openPlaylistPicker: (song) => set({ playlistPickerSong: song }),
  closePlaylistPicker: () => set({ playlistPickerSong: null }),

  createPlaylistOpen: false,
  openCreatePlaylist: () => set({ createPlaylistOpen: true }),
  closeCreatePlaylist: () => set({ createPlaylistOpen: false })
}))
