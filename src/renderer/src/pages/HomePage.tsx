import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Home, Search, Library, Settings, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../store/library'
import { useUi } from '../store/ui'
import { usePlayer } from '../store/player'

export default function HomePage() {
  const navigate = useNavigate()
  const { data, loading } = useAsyncData(() => useLibrary.getState().load(), [])
  const playSongs = usePlayer((state) => state.playSongs)
  const openNowPlaying = useUi((state) => state.openNowPlaying)
  const closeNowPlaying = useUi((state) => state.closeNowPlaying)

  useEffect(() => {
    if (!loading) return
    const unsubscribe = window.echo.onDownloadProgress((progress) =>
      useLibrary.getState().applyDownloadProgress(progress)
    )
    return () => unsubscribe()
  }, [])

  const playlists = useLibrary((state) => state.snapshot.playlists)

  return (
    <div className="page home-page">
      <header className="page-header">
        <span className="eyebrow">INÍCIO</span>
        <h1>
          Bem-vindo<span className="accent-dot">.</span>
        </h1>
        <p className="page-subtitle">Echo Music para Windows</p>
      </header>

      <div className="hero" ref={navigate}>
        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3].map((_) => <div className="skeleton-shelf" />)}
          </div>
        ) : (
          <>
            {playlists.length > 0 && (
              <>
                <h2>Suas playlists</h2>
                {playlists.slice(0, 4).map((playlist) => (
                  <SongRow
                    key={playlist.id}
                    song={playlist.songs[0]}
                    songs={playlists.map((p) => p.songs)}
                    index={0}
                    number={1}
                  />
                ))}
              </>
            )}
            <>
              <button
                className="button primary large"
                onClick={() => navigate('/search')}
                disabled={playlists.length === 0}
              >
                <Search size={20} /> Buscar músicas
              </button>
              {playlists.length > 0 && (
                <button
                  className="button ghost large"
                  onClick={() => openNowPlaying('queue')}
                >
                  <Shuffle size={20} /> Fila
                </button>
              )}
            </>
          </>)
        )}
      </div>
    </div>
  )
}
