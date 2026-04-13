import { describe, expect, it, vi, afterEach } from 'vitest'
import {
  filenameForDownloadAttribute,
  triggerBrowserFileDownload,
} from './triggerBrowserFileDownload'

describe('filenameForDownloadAttribute', () => {
  it('takes last path segment', () => {
    expect(filenameForDownloadAttribute('folder/report.pdf')).toBe('report.pdf')
    expect(filenameForDownloadAttribute('C:\\docs\\x.zip')).toBe('x.zip')
  })

  it('falls back for empty', () => {
    expect(filenameForDownloadAttribute('')).toBe('download')
    expect(filenameForDownloadAttribute('///')).toBe('download')
  })
})

describe('triggerBrowserFileDownload', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses blob path when fetch returns ok', async () => {
    const blob = new Blob(['x'], { type: 'application/octet-stream' })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(blob),
      } as Response)
    )
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await triggerBrowserFileDownload('https://s3.example/file?sig=1', 'readme.txt')

    expect(fetch).toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('falls back to anchor when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('cors')))
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      expect(this.download).toBe('readme.txt')
      expect(this.href).toContain('https://s3.example/')
    })

    await triggerBrowserFileDownload('https://s3.example/file?sig=1', 'readme.txt')

    expect(clickSpy).toHaveBeenCalled()
  })
})
