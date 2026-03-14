'use client'

import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { useT } from '@/shared/i18n/useT'
import { DateRangeField } from './DateRangeField'
import type { FieldErrors } from '../model/validation'

interface DatesSectionProps {
  startsAt: string
  setStartsAt: (value: string) => void
  endsAt: string
  setEndsAt: (value: string) => void
  registrationOpensAt: string
  setRegistrationOpensAt: (value: string) => void
  registrationClosesAt: string
  setRegistrationClosesAt: (value: string) => void
  submissionsOpensAt: string
  setSubmissionsOpensAt: (value: string) => void
  submissionsClosesAt: string
  setSubmissionsClosesAt: (value: string) => void
  judgingEndsAt: string
  setJudgingEndsAt: (value: string) => void
  errors: FieldErrors
  disabled: boolean
}

export function DatesSection({
  startsAt,
  setStartsAt,
  endsAt,
  setEndsAt,
  registrationOpensAt,
  setRegistrationOpensAt,
  registrationClosesAt,
  setRegistrationClosesAt,
  submissionsOpensAt,
  setSubmissionsOpensAt,
  submissionsClosesAt,
  setSubmissionsClosesAt,
  judgingEndsAt,
  setJudgingEndsAt,
  errors,
  disabled,
}: DatesSectionProps) {
  const t = useT()

  const startsAtId = 'startsAt' as const
  const endsAtId = 'endsAt' as const
  const registrationOpensAtId = 'registrationOpensAt' as const
  const registrationClosesAtId = 'registrationClosesAt' as const
  const submissionsOpensAtId = 'submissionsOpensAt' as const
  const submissionsClosesAtId = 'submissionsClosesAt' as const
  const judgingEndsAtId = 'judgingEndsAt' as const

  return (
    <div className="flex flex-col gap-m6">
      {/* Хакатон */}
      <div className="flex flex-col gap-m2">
        <h3 className="typography-label-md text-text-primary lowercase">
          {t('hackathons.create.dates.hackathon')}
        </h3>
        <DateRangeField
          startLabel={t('hackathons.create.dates.from')}
          endLabel={t('hackathons.create.dates.to')}
          startValue={startsAt}
          endValue={endsAt}
          onStartChange={setStartsAt}
          onEndChange={setEndsAt}
          startId={startsAtId}
          endId={endsAtId}
          disabled={disabled}
          startError={errors.startsAt}
          endError={errors.endsAt}
        />
      </div>

      {/* Регистрация */}
      <div className="flex flex-col gap-m2">
        <h3 className="typography-label-md text-text-primary lowercase">
          {t('hackathons.create.dates.registration')}
        </h3>
        <DateRangeField
          startLabel={t('hackathons.create.dates.from')}
          endLabel={t('hackathons.create.dates.to')}
          startValue={registrationOpensAt}
          endValue={registrationClosesAt}
          onStartChange={setRegistrationOpensAt}
          onEndChange={setRegistrationClosesAt}
          startId={registrationOpensAtId}
          endId={registrationClosesAtId}
          disabled={disabled}
          startError={errors.registrationOpensAt}
          endError={errors.registrationClosesAt}
        />
      </div>

      {/* Сабмишены */}
      <div className="flex flex-col gap-m2">
        <h3 className="typography-label-md text-text-primary lowercase">
          {t('hackathons.create.dates.submissions')}
        </h3>
        <DateRangeField
          startLabel={t('hackathons.create.dates.from')}
          endLabel={t('hackathons.create.dates.to')}
          startValue={submissionsOpensAt}
          endValue={submissionsClosesAt}
          onStartChange={setSubmissionsOpensAt}
          onEndChange={setSubmissionsClosesAt}
          startId={submissionsOpensAtId}
          endId={submissionsClosesAtId}
          disabled={disabled}
          startError={errors.submissionsOpensAt}
          endError={errors.submissionsClosesAt}
        />
      </div>

      {/* Оценка */}
      <div className="flex flex-col gap-m2">
        <h3 className="typography-label-md text-text-primary lowercase">
          {t('hackathons.create.dates.judging')}
        </h3>
        <div className="flex items-center gap-m4">
          <span className="typography-label-sm text-text-secondary whitespace-nowrap">
            {t('hackathons.create.dates.until')}
          </span>
          <Input
            id={judgingEndsAtId}
            type="datetime-local"
            value={judgingEndsAt}
            onChange={e => setJudgingEndsAt(e.target.value)}
            disabled={disabled}
            error={errors.judgingEndsAt}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
