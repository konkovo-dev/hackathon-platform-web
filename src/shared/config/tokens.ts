/**
 * Design Tokens - единый источник правды для всех токенов дизайна
 *
 * Этот файл генерируется из tokens.json или может быть импортирован напрямую.
 * Используется для типобезопасного доступа к токенам в TypeScript коде.
 */

export const tokens = {
  colors: {
    brand: {
      primary: '#4F46E5',
      primaryHover: '#4338CA',
      primaryActive: '#3730A3',
      secondary: '#06B6D4',
      accent: '#F97316',
    },
    bg: {
      default: '#0B1020',
      surface: '#111A2E',
      elevated: '#16213A',
      hover: '#1B2A4A',
      selected: '#22345D',
    },
    text: {
      primary: '#EAF0FF',
      secondary: '#B7C2E1',
      tertiary: '#8EA0CC',
      inverse: '#0B1020',
      disabled: '#5D6B93',
    },
    border: {
      default: '#24355D',
      strong: '#2F4576',
      focus: '#7C83FF',
    },
    divider: '#1E2C4D',
    icon: {
      primary: '#DCE5FF',
      secondary: '#9FB0DE',
    },
    state: {
      success: '#22C55E',
      successBg: '#0B2A1A',
      warning: '#F59E0B',
      warningBg: '#2A200B',
      error: '#EF4444',
      errorBg: '#2A0B10',
      info: '#3B82F6',
      infoBg: '#0B1E2A',
    },
    status: {
      new: '#3B82F6',
      inProgress: '#F59E0B',
      closed: '#22C55E',
      draft: '#A78BFA',
      submitted: '#22C55E',
      overdue: '#EF4444',
      pending: '#F59E0B',
      accepted: '#22C55E',
      declined: '#EF4444',
      expired: '#94A3B8',
      canceled: '#64748B',
    },
    link: {
      default: '#7C83FF',
      hover: '#A5B4FC',
    },
    focusRing: '#93C5FD',
    overlayScrim: '#000000',
    shadowColor: '#000000',
  },
  typography: {
    'display-2xl': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '48px',
      lineHeight: '56px',
      letterSpacing: '0px',
    },
    'display-xl': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '40px',
      lineHeight: '48px',
      letterSpacing: '0px',
    },
    'heading-lg': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '32px',
      lineHeight: '40px',
      letterSpacing: '0px',
    },
    'heading-md': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '28px',
      lineHeight: '36px',
      letterSpacing: '0px',
    },
    'heading-sm': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '0px',
    },
    'title-lg': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    'title-md': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '26px',
      letterSpacing: '0px',
    },
    'title-sm': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    'body-lg-regular': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    'body-lg-medium': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    'body-md-regular': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    'body-md-medium': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    'body-sm-regular': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '18px',
      letterSpacing: '0px',
    },
    'body-sm-medium': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '18px',
      letterSpacing: '0px',
    },
    'label-lg': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    'label-md': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: '0px',
    },
    'label-sm': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
    'label-xs': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '11px',
      lineHeight: '14px',
      letterSpacing: '0px',
    },
    'caption-sm-regular': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
    'caption-sm-medium': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
    'caption-xs': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: '11px',
      lineHeight: '14px',
      letterSpacing: '0px',
    },
    'overline-xs': {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 600,
      fontSize: '11px',
      lineHeight: '14px',
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
    },
    'code-sm': {
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
  },
  spacing: {
    m: 2,
    m2: 4,
    m3: 6,
    m4: 8,
    m5: 10,
    m6: 12,
    m7: 14,
    m8: 16,
    m9: 18,
    m10: 20,
    m11: 22,
    m12: 24,
    m13: 26,
    m14: 28,
    m15: 30,
    m16: 32,
    m17: 34,
    m18: 36,
    m19: 38,
    m20: 40,
    m21: 42,
    m22: 44,
    m23: 46,
    m24: 48,
    m25: 50,
    m26: 52,
    m27: 54,
    m28: 56,
    m29: 58,
    m30: 60,
    m31: 62,
    m32: 64,
  },
} as const

/**
 * Типы для типобезопасного доступа к токенам
 */
export type TokenColor = typeof tokens.colors
export type TokenColorPath = keyof TokenColor | `${keyof TokenColor}.${string}`

/**
 * Утилита для получения цвета по пути (для использования в JS/TS)
 * Пример: getColor('brand.primary') => '#4F46E5'
 */
export function getColor(path: string): string {
  const parts = path.split('.')
  let value: any = tokens.colors
  for (const part of parts) {
    value = value[part]
    if (value === undefined) {
      throw new Error(`Color token not found: ${path}`)
    }
  }
  return value as string
}
