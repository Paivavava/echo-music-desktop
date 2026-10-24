import { app, BrowserWindow, nativeTheme, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Store } from './store'
import { YouTubeMusic } from './ytmusic'
import { LyricsService } from './lyrics'
import { DownloadManager } from './downloads'
import { StreamServer } from './streamServer'
import { YtDlp } from './ytdlp'
import { AudioCache } from './audioCache'
import { registerIpc } from './ipc'

const APP_ID = 'fun.echomusic.desktop'
let mainWindow: BrowserWindow | null = null

app.setAppUserModelId(APP_ID)

if (!app.requestSingleInstanceLock()) {
  app.quit()
}

const userData = app.getPath('userData')
const store = new Store(userData)
const music = new YouTubeMusic(userData)
const lyrics = new LyricsService(music)
let mainWindowRef: BrowserWindow | null = null

const ytdlp = new YtDlp()
const audioCache = new AudioCache(path.join(userData, 'audio-cache'), ytdlp)

const downloads = new DownloadManager(store, ytdlp, userData, (progress) => {
  const target = mainWindowRef
  if (target && !target.isDestroyed()) {
    target.webContents.send('downloads:progress', progress)
  }
})

const streams = new StreamServer({
  audioCache,
  quality: () => store.settings.audioQuality,
  getDownload: (id) => downloads.getFile(id)
})

function titleBarColors(dark: boolean): { color: string; symbolColor: string } {
  return dark
    ? { color: '#080808', symbolColor: '#f2f2f2' }
    : { color: '#f6f4f1', symbolColor: '#151515' }
}

function createWindow(): BrowserWindow {
  const colors = titleBarColors(nativeTheme.shouldUseDarkColors)

  const window = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1040,
    minHeight: 700,
    show: false,
    backgroundColor: colors.color,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: colors.color,
      symbolColor: colors.symbolColor,
      height: 48
    },
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  window.once('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//i.test(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    const devUrl = process.env.ELECTRON_RENDERER_URL
    if (devUrl && url.startsWith(devUrl)) return
    if (url.startsWith('file://')) return
    event.preventDefault()
    if (/^https:\/\//i.test(url)) void shell.openExternal(url)
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void window.loadFile(path.join(fileURLToPath(new URL('.', import.meta.url)), '../renderer/index.html'))
  }

  window.on('closed', () => {
    if (mainWindow === window) mainWindow = null
    if (mainWindowRef === window) mainWindowRef = null
  })

  return window
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.whenReady().then(async () => {
  await store.load()
  await downloads.init()
  await streams.start()
  await audioCache.cleanup()
  void audioCache.clearPartialsOlderThan(2)
  const ytdlpVersion = await ytdlp.check()
  if (ytdlpVersion) console.log(`[audio] yt-dlp ${ytdlpVersion}`)
  else console.warn('[audio] yt-dlp não encontrado — reprodução e downloads indisponíveis')

  nativeTheme.themeSource = store.settings.theme

  registerIpc({ store, music, lyrics, downloads, streams, ytdlp }, () => mainWindow)

  mainWindow = createWindow()
  mainWindowRef = mainWindow

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
      mainWindowRef = mainWindow
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  void store.flush()
  streams.stop()
})
