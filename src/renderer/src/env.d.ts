/// <reference types="vite/client" />

import type { EchoApi } from '@shared/types'

declare global {
  interface Window {
    echo: EchoApi
  }
}

export {}
