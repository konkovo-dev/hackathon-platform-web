export function formatDateRange(startDate?: string, endDate?: string, locale: string = 'ru'): string {
  if (!startDate || !endDate) {
    return ''
  }

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return ''
    }

    const startDay = start.getDate()
    const endDay = end.getDate()
    const month = start.toLocaleDateString(locale, { month: 'long' })
    const year = start.getFullYear()

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${startDay}-${endDay} ${month} ${year}`
    }

    const startMonth = start.toLocaleDateString(locale, { month: 'long' })
    const endMonth = end.toLocaleDateString(locale, { month: 'long' })
    
    if (start.getFullYear() === end.getFullYear()) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
    }

    return `${startDay} ${startMonth} ${start.getFullYear()} - ${endDay} ${endMonth} ${end.getFullYear()}`
  } catch {
    return ''
  }
}

export function formatLocation(location: { online: boolean; city?: string; country?: string }): string {
  const parts: string[] = []

  if (location.online) {
    parts.push('online')
  }

  if (location.city) {
    parts.push(location.city)
  } else if (location.country) {
    parts.push(location.country)
  }

  return parts.join(' / ')
}
