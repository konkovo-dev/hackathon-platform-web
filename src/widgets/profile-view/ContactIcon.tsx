import type { ContactType } from '@/entities/user/model/types'

export const CONTACT_ICONS: Partial<Record<ContactType, string>> = {
  CONTACT_TYPE_EMAIL: '/icons/icon-mail/icon-mail-sm.svg',
  CONTACT_TYPE_TELEGRAM: '/icons/icon-telegram/icon-telegram-sm.svg',
  CONTACT_TYPE_GITHUB: '/icons/icon-github/icon-github-sm.svg',
  CONTACT_TYPE_LINKEDIN: '/icons/icon-linkedin/icon-linkedin-sm.svg',
}

export function ContactIcon({ src }: { src: string }) {
  return (
    <span
      className="w-m8 h-m8 block bg-icon-primary"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
      }}
    />
  )
}
