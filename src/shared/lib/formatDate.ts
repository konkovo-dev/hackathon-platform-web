export function formatDateRange(
  startDate?: string,
  endDate?: string,
  locale: string = 'ru'
): string {
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

export function formatLocation(
  location?: {
    online: boolean
    city?: string
    country?: string
  }
): string {
  if (!location) {
    return ''
  }

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

export function formatRelativeTime(date: string | Date, locale: string = 'ru'): string {
  try {
    const now = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date

    if (isNaN(targetDate.getTime())) {
      return ''
    }

    const diffMs = now.getTime() - targetDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // Сейчас (меньше минуты)
    if (diffMinutes < 1) {
      return locale === 'ru' ? 'сейчас' : 'now'
    }

    // Минуты назад (до часа)
    if (diffMinutes < 60) {
      if (locale === 'ru') {
        if (diffMinutes === 1) return '1 минуту назад'
        if (diffMinutes < 5) return `${diffMinutes} минуты назад`
        return `${diffMinutes} минут назад`
      }
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
    }

    // Часы назад (до 24 часов)
    if (diffHours < 24) {
      if (locale === 'ru') {
        if (diffHours === 1) return '1 час назад'
        if (diffHours < 5) return `${diffHours} часа назад`
        return `${diffHours} часов назад`
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    }

    // Дата в формате дд.мм
    const day = targetDate.getDate().toString().padStart(2, '0')
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0')

    // Если год отличается, добавляем год
    if (targetDate.getFullYear() !== now.getFullYear()) {
      const year = targetDate.getFullYear()
      return `${day}.${month}.${year}`
    }

    return `${day}.${month}`
  } catch {
    return ''
  }
}
