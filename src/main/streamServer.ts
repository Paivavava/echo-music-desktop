export class StreamServer {
  constructor(public audioCache, public qualityGetter, public getDownload) {}

  async baseUrl() {
    const info = await this.audioCache.getCacheInfo()
    return `http://127.0.0.1:${info.port}`
  }
}
