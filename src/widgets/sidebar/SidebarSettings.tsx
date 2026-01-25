'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { MenuItem } from '@/shared/ui/MenuItem'
import { Switch } from '@/shared/ui/Switch'
import { useI18n } from '@/shared/i18n/useT'
import { useT } from '@/shared/i18n/useT'
import { useTheme } from '@/shared/lib/theme'

const SETTINGS_ICON = '/icons/icon-settings/icon-settings-md.svg'

export type SidebarSettingsProps = {
  collapsed: boolean
  pathname: string
  debug: boolean
  setDebug: (next: boolean) => void
}

export function SidebarSettings({ collapsed, pathname, debug, setDebug }: SidebarSettingsProps) {
  const t = useT()
  const { locale, setLocale } = useI18n()
  const { theme, setTheme, mounted } = useTheme()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const localeEn = 'en' as const
  const localeRu = 'ru' as const

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className={cn('w-full', collapsed ? 'relative flex justify-center' : undefined)}>
      <MenuItem
        iconSrc={SETTINGS_ICON}
        title={t('sidebar.items.settings')}
        active={open}
        collapsed={collapsed}
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <div
          className={cn(
            'mt-m4 rounded-[var(--spacing-m6)] bg-bg-elevated p-m6',
            collapsed ? 'absolute top-0 left-full ml-m4 w-[240px] z-50 mt-0' : 'w-full'
          )}
        >
          <div className="flex flex-col gap-m6">
            <div className="flex items-center justify-between">
              <div className="typography-caption-sm-regular text-text-primary">
                {t('sidebar.settings_panel.debug')}
              </div>
              <Switch
                checked={debug}
                onChange={(e) => {
                  const next = e.target.checked
                  setDebug(next)

                  if (next) {
                    router.push('/design-system')
                  } else if (pathname === '/design-system') {
                    router.push('/')
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="typography-caption-sm-regular text-text-primary">
                {t('sidebar.settings_panel.theme')}
              </div>
              <Switch
                checked={mounted ? theme === 'dark' : false}
                disabled={!mounted}
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="typography-caption-sm-regular text-text-primary">
                {t('sidebar.settings_panel.language')}
              </div>
              <div className="inline-flex rounded-[var(--spacing-m6)] border border-border-default overflow-hidden">
                <Button
                  variant={locale === 'en' ? 'primary' : 'secondary'}
                  size="sm"
                  type="button"
                  className="rounded-none px-m4"
                  text={localeEn}
                  onClick={() => setLocale(localeEn)}
                />
                <Button
                  variant={locale === 'ru' ? 'primary' : 'secondary'}
                  size="sm"
                  type="button"
                  className="rounded-none px-m4"
                  text={localeRu}
                  onClick={() => setLocale(localeRu)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
