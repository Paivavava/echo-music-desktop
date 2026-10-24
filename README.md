# Echo Music — Desktop

Versão desktop (Windows) do Echo Music, construída com Electron + React + TypeScript. Mantém a linguagem visual Nothing OS do app Android e usa o YouTube Music como catálogo, sem anúncios.

## Recursos
- **Início** com shelves de novidades, tendências e mixes
- **Busca** unificada (músicas, álbuns, artistas, playlists e vídeos) com sugestões
- **Player** completo: play/pause, anterior/próxima, aleatório, repeat, seek, volume e Media Session
- **Fila** reordenável com remoção de faixas
- **Letras sincronizadas** via LRCLIB, com destaque da linha atual e rolagem automática
- **Biblioteca** local: curtidas, histórico, playlists e downloads
- **Rádio/mix** a partir de qualquer faixa
- **Downloads offline** com progresso e reprodução do arquivo local
- **Tema** escuro/claro, preto puro e animações reduzidas
- Atalhos: `Ctrl+F` busca, `Espaço` play/pause, `←/→` seek, `Esc` fecha o Now Playing

## Arquitetura
| Camada | Tecnologia |
|---|---|
| Shell | Electron |
| UI | React 19 + React Router + Zustand + Lucide |
| Catálogo/letras | `youtubei.js` (InnerTube) + API LRCLIB |
| Áudio/downloads | `yt-dlp` empacotado + servidor HTTP local com Range e cache |
| Persistência | JSON em `%APPDATA%/Echo Music/library.json` |

O catálogo e as metadados vêm do InnerTube; o áudio é extraído pelo yt-dlp e servido em `127.0.0.1` para o `<audio>` do renderer, com cache em disco e suporte a seek.

## Desenvolvimento
Requisitos: Node.js 20+ e Windows (para empacotar).

```bash
cd desktop
npm install
npm run dev
```

## Testes e build
```bash
npm run typecheck
npm test           # parser LRC
npm run build
node tests/smoke.mjs   # abre o app real e valida home, busca, playback, like, seek, letras, fila e biblioteca
```

## Empacotar para Windows
```bash
npm run package:win
```

Os artefatos saem em `release/`:
- `Echo Music-1.0.0-x64.exe` — instalador NSIS
- `Echo Music-1.0.0-x64.exe` (portable) — executável sem instalação

O `resources/yt-dlp.exe` é copiado para os recursos do app. Para atualizar o extrator, substitua esse binário pela versão mais recente de [yt-dlp](https://github.com/yt-dlp/yt-dlp/releases).

## Notas
- O app não hospeda conteúdo: apenas reproduz o catálogo público do YouTube Music.
- Alguns vídeos podem bloquear a extração de áudio conforme região/conta; nesses casos o player mostra um erro em vez de falhar silenciosamente.
- Letras dependem da disponibilidade pública no LRCLIB; quando não há letra sincronizada, o app mostra a letra simples ou uma mensagem.
- O `yt-dlp.exe` está embutido em `resources/`. Quando o YouTube mudar algo, basta substituir esse binário pela versão mais recente.
- Até o momento o instalador não é assinado digitalmente, então o Windows SmartScreen pode exibir um aviso na primeira execução.

---

# Echo Music — Desktop (English)

Windows desktop version of Echo Music, built with Electron + React + TypeScript. Keeps the Nothing OS visual language from the Android app and uses YouTube Music as the catalog, ad-free.

## Features
- **Home** with shelves of new releases, trends and mixes
- **Unified search** (songs, albums, artists, playlists and videos) with suggestions
- **Full player**: play/pause, previous/next, random, repeat, seek, volume and Media Session
- **Queue** reorderable with track removal
- **Synced lyrics** via LRCLIB, with current line highlight and auto-scrolling
- **Local library**: liked songs, history, playlists and downloads
- **Radio/mix** from any track
- **Offline downloads** with progress and local file playback
- **Theme** dark/light, pure black and reduced animations
- Shortcuts: `Ctrl+F` search, `Space` play/pause, `←/→` seek, `Esc` closes Now Playing

## Architecture
| Layer | Technology |
|---|---|
| Shell | Electron |
| UI | React 19 + React Router + Zustand + Lucide |
| Catalog/lyrics | `youtubei.js` (InnerTube) + LRCLIB API |
| Audio/downloads | Bundled `yt-dlp` + local HTTP server with Range and cache |
| Persistence | JSON in `%APPDATA%/Echo Music/library.json` |

The catalog and metadata come from InnerTube; audio is extracted by yt-dlp and served on `127.0.0.1` to the renderer's `<audio>` element, with disk cache and seek support.

## Development
Requirements: Node.js 20+ and Windows (for packaging).

```bash
cd desktop
npm install
npm run dev
```

## Tests and build
```bash
npm run typecheck
npm test           # LRC parser tests
npm run build
node tests/smoke.mjs   # opens real app and validates home, search, playback, like, seek, lyrics, queue and library
```

## Package for Windows
```bash
npm run package:win
```

Artifacts go to `release/`:
- `Echo Music-1.0.0-x64.exe` — NSIS installer
- `Echo Music-1.0.0-x64.exe` (portable) — executable without installation

The `resources/yt-dlp.exe` is copied to the app resources. To update the extractor, replace this file with the latest version from [yt-dlp](https://github.com/yt-dlp/yt-dlp/releases).

## Notes
- The app does not host content: it only reproduces the public YouTube Music catalog.
- Some videos may block audio extraction depending on region/account; in these cases the player shows an error instead of silently failing.
- Lyrics depend on public availability on LRCLIB; when there's no synced lyric, the app shows plain lyrics or a message.
- The `yt-dlp.exe` is embedded in `resources/`. When YouTube changes something, just replace this binary with the latest version.
- So far the installer is not digitally signed, so Windows SmartScreen may show a warning on first run.
```
