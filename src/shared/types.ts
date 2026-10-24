export type SongKind = 'song' | 'video'
export interface ArtistRef {
  id?: string
  name: string}
export interface AlbumRef {
  id?: string
  name: string}
export interface Song {
  id: string
  title: string
  artists: ArtistRef[]
  album?: AlbumRef
  /** Duration in seconds. 0 when unknown. */
  duration: number
  thumbnail?: string
  kind: SongKind}
export type CardKind = 'album' | 'playlist' | 'artist' | 'song' | 'video' | 'browse'
export interface MediaCard {
  kind: CardKind
  id: string
  title: string
  subtitle?: string
  thumbnail?: string
  /** Round artwork for artists. */
  round?: boolean
  browseId?: string
  params?: string
  song?: Song}
export interface Shelf {
  title: string
  items: MediaCard[]}
export interface HomePageData {
  shelves: Shelf[]}
export interface ExploreButton {
  label: string
  browseId: string
  params?: string}
export interface ExplorePageData {
  buttons: ExploreButton[]
  shelves: Shelf[]}
export interface BrowsePageData {
  title: string
  shelves: Shelf[]}
export interface SearchPageData {
  songs: Song[]
  videos: Song[]
  albums: MediaCard[]
  artists: MediaCard[]
  playlists: MediaCard[]}
export type SearchFilter = 'all' | 'song' | 'video' | 'album' | 'artist' | 'playlist'
export interface AlbumPageData {
  id: string
  title: string
  subtitle?: string
  year?: string
  description?: string
  thumbnail?: string
  artists: ArtistRef[]
  songs: Song[]
  more: Shelf[]}
export interface ArtistPageData {
  id: string
  name: string
  description?: string
  thumbnail?: string
  songs: Song[]
  albums: MediaCard[]
  singles: MediaCard[]
  playlists: MediaCard[]
  more: Shelf[]}
export interface PlaylistPageData {
  id: string
  title: string
  description?: string
  thumbnail?: string
  author?: string
  songs: Song[]}
export interface LyricsLine {
  /** Seconds from the start of the track, or null for unsynced lyrics. */
  time: number | null
  text: string}
export type LyricsSource = 'LRCLIB' | 'YouTube Music' | 'none'
export interface LyricsResult {
  synced: boolean
  lines: LyricsLine[]
  source: LyricsSource
  plain?: string}
export interface LocalPlaylist {
  id: string
  name: string
  description?: string
  songs: Song[]
  createdAt: number
  updatedAt: number}
export interface HistoryEntry {
  song: Song
  at: number}
export interface Settings {
  theme: 'system' | 'dark' | 'light'
  pureBlack: boolean
  animations: boolean
  audioQuality: 'best' | 'high'
  volume: number}
export type DownloadStatus = 'downloading' | 'done' | 'error'
export interface DownloadRecord {
  id: string
  song: Song
  quality: 'best' | 'high'
  size: number
  progress: number
  status: DownloadStatus
  error?: string
  createdAt: number}
export interface DownloadProgress {
  id: string
  progress: number
  status: DownloadStatus
  size?: number
  error?: string}
export interface StoreSnapshot {
  likedSongs: Song[]
  history: HistoryEntry[]
  playlists: LocalPlaylist[]
  settings: Settings
  downloads: DownloadRecord[]}
export interface AppPaths {
  downloads: string
  data: string}
export interface AppInfo {
  version: string
  electron: string
  platform: string
  ytdlp: string | null
  paths: AppPaths}
export interface EchoApi {
  search(query: string, filter: SearchFilter): Promise<SearchPageData>
  suggestions(query: string): Promise<string[]>
  home(): Promise<HomePageData>
  explore(): Promise<ExplorePageData>
  browse(browseId: string, params?: string): Promise<BrowsePageData>
  album(id: string): Promise<AlbumPageData>
  artist(id: string): Promise<ArtistPageData>
  playlist(id: string): Promise<PlaylistPageData>
  radio(videoId: string): Promise<Song[]>
  lyrics(song: Song): Promise<LyricsResult>
  streamBase(): Promise<string>

  getStore(): Promise<StoreSnapshot>
  toggleLike(song: Song): Promise<StoreSnapshot>
  addHistory(song: Song): Promise<StoreSnapshot>
  createPlaylist(name: string, song?: Song): Promise<StoreSnapshot>
  renamePlaylist(id: string, name: string): Promise<StoreSnapshot>
  deletePlaylist(id: string): Promise<StoreSnapshot>
  addToPlaylist(playlistId: string, song: Song): Promise<StoreSnapshot>
  removeFromPlaylist(playlistId: string, songId: string): Promise<StoreSnapshot>
  updateSettings(settings: Partial<Settings>): Promise<StoreSnapshot>

  listDownloads(): Promise<DownloadRecord[]>
  download(song: Song): Promise<DownloadRecord[]>
  cancelDownload(id: string): Promise<DownloadRecord[]>
  removeDownload(id: string): Promise<DownloadRecord[]>
  openDownloadsFolder(): Promise<void>

  appInfo(): Promise<AppInfo>
  setTheme(theme: 'system' | 'dark' | 'light'): Promise<void>
  openDataFolder(): Promise<void>
  openExternal(url: string): Promise<void>
  onDownloadProgress(cb: (progress: DownloadProgress) => void): () => void}
