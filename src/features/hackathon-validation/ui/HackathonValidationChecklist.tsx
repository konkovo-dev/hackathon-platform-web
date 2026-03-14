'use client'

import { Section, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { localizeValidationError } from '@/shared/lib/validation/localizeValidationError'
import { PublishHackathonButton } from '@/features/hackathon-publish/ui/PublishHackathonButton'
import { useValidateHackathonQuery } from '../model/hooks'

export interface HackathonValidationChecklistProps {
  hackathonId: string
}

export function HackathonValidationChecklist({ hackathonId }: HackathonValidationChecklistProps) {
  const t = useT()
  const { data, isLoading, isError } = useValidateHackathonQuery(hackathonId)

  const errors = data?.validationErrors || []
  const isValid = !isLoading && !isError && errors.length === 0

  return (
    <Section title={t('hackathons.validation.title')}>
      <div className="flex flex-col gap-m6">
        {isLoading ? (
          <p className="typography-body-sm-regular text-text-secondary">
            {t('hackathons.list.loading')}
          </p>
        ) : isError ? (
          <p className="typography-body-sm-regular text-state-error">
            {t('hackathons.list.error')}
          </p>
        ) : isValid ? (
          <div className="flex items-center gap-m3">
            <Icon 
              src="/icons/icon-tick/icon-tick-sm.svg" 
              size="sm" 
              colorClassName="bg-state-success"
            />
            <span className="typography-body-md-regular text-state-success">
              {t('hackathons.validation.ready')}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-m3">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start gap-m3">
                <Icon 
                  src="/icons/icon-cross/icon-cross-sm.svg" 
                  size="sm" 
                  colorClassName="bg-state-error"
                  className="flex-shrink-0 mt-[2px]"
                />
                <span className="typography-body-sm-regular text-state-error">
                  {localizeValidationError(error, t)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка публикации */}
        <div>
          <PublishHackathonButton
            hackathonId={hackathonId}
            disabled={!isValid || isLoading}
          />
        </div>
      </div>
    </Section>
  )
}
