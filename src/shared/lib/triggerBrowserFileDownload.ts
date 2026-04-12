/** Имя для атрибута `download` без путей. */
export function filenameForDownloadAttribute(stored: string): string {
  const parts = stored.split(/[/\\]/)
  const last = parts[parts.length - 1]?.trim()
  return last && last.length > 0 ? last : 'download'
}

/**
 * Сохраняет файл из URL в загрузки браузера: при успешном `fetch` + CORS — blob + `a[download]`
 * (реальное «Сохранить как» / загрузки). Иначе — `<a download href>` (на другом origin `download`
 * часто игнорируется, тогда поведение зависит от заголовков S3).
 */
export async function triggerBrowserFileDownload(
  url: string,
  suggestedFilename: string
): Promise<void> {
  const downloadName = filenameForDownloadAttribute(suggestedFilename)

  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit', cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    try {
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = downloadName
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
    return
  } catch {
    // fall through
  }

  const a = document.createElement('a')
  a.href = url
  a.download = downloadName
  a.rel = 'noopener noreferrer'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
