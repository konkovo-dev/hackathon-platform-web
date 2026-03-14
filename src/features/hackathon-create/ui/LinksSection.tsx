'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/Icon'
import { Input } from '@/shared/ui/Input'
import { useT } from '@/shared/i18n/useT'
import type { FieldErrors } from '../model/validation'

export type LinkItem = {
  title: string
  url: string
}

interface LinksSectionProps {
  links: LinkItem[]
  setLinks: (links: LinkItem[]) => void
  errors: FieldErrors
  disabled: boolean
}

export function LinksSection({ links, setLinks, errors, disabled }: LinksSectionProps) {
  const t = useT()

  // Автоматически добавляем пустое поле, если все поля заполнены
  useEffect(() => {
    if (links.length === 0) {
      setLinks([{ title: '', url: '' }])
      return
    }

    const lastLink = links[links.length - 1]
    const hasEmptyField = links.some(link => !link.title.trim() && !link.url.trim())

    if (lastLink.title.trim() || lastLink.url.trim()) {
      if (!hasEmptyField) {
        setLinks([...links, { title: '', url: '' }])
      }
    }
  }, [links, setLinks])

  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    // Всегда оставляем хотя бы одно пустое поле
    if (newLinks.length === 0) {
      setLinks([{ title: '', url: '' }])
    } else {
      setLinks(newLinks)
    }
  }

  return (
    <div className="flex flex-col gap-m6">
      {links.map((link, index) => {
        const isEmpty = !link.title.trim() && !link.url.trim()
        const isLast = index === links.length - 1
        const showRemove = !isEmpty || !isLast

        return (
          <div key={index} className="flex items-center gap-m4">
            <div className="flex-1">
              <Input
                placeholder={t('hackathons.create.fields.linkTitle')}
                value={link.title}
                onChange={e => updateLink(index, 'title', e.target.value)}
                disabled={disabled}
                error={errors[`link_${index}_title`]}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder={t('hackathons.create.fields.linkUrl')}
                value={link.url}
                onChange={e => updateLink(index, 'url', e.target.value)}
                disabled={disabled}
                error={errors[`link_${index}_url`]}
              />
            </div>
            {showRemove ? (
              <Button
                variant="icon-secondary"
                size="sm"
                onClick={() => removeLink(index)}
                disabled={disabled}
              >
                <Icon src="/icons/icon-cross/icon-cross-sm.svg" size="sm" />
              </Button>
            ) : (
              <div className="w-m16" />
            )}
          </div>
        )
      })}
    </div>
  )
}
