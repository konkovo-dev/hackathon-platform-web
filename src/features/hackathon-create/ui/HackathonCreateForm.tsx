'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/shared/ui/Section'
import { Button } from '@/shared/ui/Button'
import { MarkdownEditor } from '@/shared/ui/MarkdownEditor'
import { useT } from '@/shared/i18n/useT'
import { ApiError } from '@/shared/api/errors'
import { useCreateHackathonMutation } from '../model/hooks'
import { validateHackathonForm, type FieldErrors } from '../model/validation'
import { BasicInfoSection } from './BasicInfoSection'
import { LocationSection } from './LocationSection'
import { DatesSection } from './DatesSection'
import { RegistrationPolicySection } from './RegistrationPolicySection'
import { LimitsSection } from './LimitsSection'
import { LinksSection, type LinkItem } from './LinksSection'
import type { CreateHackathonRequest } from '../api/createHackathon'

export function HackathonCreateForm() {
  const t = useT()
  const router = useRouter()
  const createMutation = useCreateHackathonMutation()

  const [name, setName] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')

  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')
  const [online, setOnline] = useState(false)

  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [registrationOpensAt, setRegistrationOpensAt] = useState('')
  const [registrationClosesAt, setRegistrationClosesAt] = useState('')
  const [submissionsOpensAt, setSubmissionsOpensAt] = useState('')
  const [submissionsClosesAt, setSubmissionsClosesAt] = useState('')
  const [judgingEndsAt, setJudgingEndsAt] = useState('')

  const [allowIndividual, setAllowIndividual] = useState(true)
  const [allowTeam, setAllowTeam] = useState(true)

  const [teamSizeMax, setTeamSizeMax] = useState('')

  const [links, setLinks] = useState<LinkItem[]>([{ title: '', url: '' }])

  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isPending = createMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const validation = validateHackathonForm({ name })
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      setFormError(validation.message || t('hackathons.create.errors.required'))
      return
    }

    const payload: CreateHackathonRequest = {
      name: name.trim(),
      state: 'DRAFT',
    }

    if (shortDescription.trim()) {
      payload.shortDescription = shortDescription.trim()
    }

    if (description.trim()) {
      payload.description = description.trim()
    }

    if (city.trim() || venue.trim() || online) {
      payload.location = {
        online,
        ...(city.trim() && { city: city.trim() }),
        ...(venue.trim() && { venue: venue.trim() }),
      }
    }

    const dates: CreateHackathonRequest['dates'] = {}
    let hasDates = false

    if (startsAt) {
      dates.startsAt = new Date(startsAt).toISOString()
      hasDates = true
    }
    if (endsAt) {
      dates.endsAt = new Date(endsAt).toISOString()
      hasDates = true
    }
    if (registrationOpensAt) {
      dates.registrationOpensAt = new Date(registrationOpensAt).toISOString()
      hasDates = true
    }
    if (registrationClosesAt) {
      dates.registrationClosesAt = new Date(registrationClosesAt).toISOString()
      hasDates = true
    }
    if (submissionsOpensAt) {
      dates.submissionsOpensAt = new Date(submissionsOpensAt).toISOString()
      hasDates = true
    }
    if (submissionsClosesAt) {
      dates.submissionsClosesAt = new Date(submissionsClosesAt).toISOString()
      hasDates = true
    }
    if (judgingEndsAt) {
      dates.judgingEndsAt = new Date(judgingEndsAt).toISOString()
      hasDates = true
    }

    if (hasDates) {
      payload.dates = dates
    }

    payload.registrationPolicy = {
      allowIndividual,
      allowTeam,
    }

    if (teamSizeMax) {
      const size = parseInt(teamSizeMax, 10)
      if (!isNaN(size) && size > 0) {
        payload.limits = { teamSizeMax: size }
      }
    }

    const validLinks = links.filter(link => link.title.trim() && link.url.trim())
    if (validLinks.length > 0) {
      payload.links = validLinks.map(link => ({
        title: link.title.trim(),
        url: link.url.trim(),
      }))
    }

    try {
      const response = await createMutation.mutateAsync(payload)
  
      if (response.hackathonId) {
        router.push(`/hackathons/${response.hackathonId}`)
        return
      }

      if (response.validationErrors && response.validationErrors.length > 0) {
        const errors: FieldErrors = {}
        response.validationErrors.forEach(err => {
          if (err.field) {
            errors[err.field] = true
          }
        })
        setFieldErrors(errors)
        setFormError(
          response.validationErrors.map(err => err.message).join(', ') ||
            t('hackathons.create.errors.unknown')
        )
        return
      }
    } catch (err) {
      console.error('Create hackathon error:', err)
      const api = err instanceof ApiError ? err.data : null
      setFormError((api?.message && api.message.trim()) || t('hackathons.create.errors.unknown'))
    }
  }

  const handleCancel = () => {
    router.push('/hackathons')
  }

  const alertRole = 'alert' as const
  const ariaLivePolite = 'polite' as const

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-m8">
      <h1 className="typography-heading-lg text-text-primary">{t('hackathons.create.title')}</h1>

      <Section title={t('hackathons.create.sections.basic_info')}>
        <BasicInfoSection
          name={name}
          setName={setName}
          shortDescription={shortDescription}
          setShortDescription={setShortDescription}
          errors={fieldErrors}
          disabled={isPending}
        />
      </Section>

      <Section title={t('hackathons.create.sections.description')}>
        <MarkdownEditor
          placeholder={t('hackathons.create.fields.description')}
          value={description}
          onChange={setDescription}
          disabled={isPending}
          error={fieldErrors.description}
        />
      </Section>

      <div className="grid grid-cols-2 gap-m8">
        <Section title={t('hackathons.create.sections.location')}>
          <LocationSection
            city={city}
            setCity={setCity}
            venue={venue}
            setVenue={setVenue}
            online={online}
            setOnline={setOnline}
            errors={fieldErrors}
            disabled={isPending}
          />
        </Section>

        <Section title={t('hackathons.create.sections.dates')}>
          <DatesSection
            startsAt={startsAt}
            setStartsAt={setStartsAt}
            endsAt={endsAt}
            setEndsAt={setEndsAt}
            registrationOpensAt={registrationOpensAt}
            setRegistrationOpensAt={setRegistrationOpensAt}
            registrationClosesAt={registrationClosesAt}
            setRegistrationClosesAt={setRegistrationClosesAt}
            submissionsOpensAt={submissionsOpensAt}
            setSubmissionsOpensAt={setSubmissionsOpensAt}
            submissionsClosesAt={submissionsClosesAt}
            setSubmissionsClosesAt={setSubmissionsClosesAt}
            judgingEndsAt={judgingEndsAt}
            setJudgingEndsAt={setJudgingEndsAt}
            errors={fieldErrors}
            disabled={isPending}
          />
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-m8">
        <Section title={t('hackathons.create.sections.registration_policy')}>
          <RegistrationPolicySection
            allowIndividual={allowIndividual}
            setAllowIndividual={setAllowIndividual}
            allowTeam={allowTeam}
            setAllowTeam={setAllowTeam}
            disabled={isPending}
          />
        </Section>

        <Section title={t('hackathons.create.fields.teamSizeMax')}>
          <LimitsSection
            teamSizeMax={teamSizeMax}
            setTeamSizeMax={setTeamSizeMax}
            errors={fieldErrors}
            disabled={isPending}
          />
        </Section>
      </div>

      <Section title={t('hackathons.create.sections.links')}>
        <LinksSection links={links} setLinks={setLinks} errors={fieldErrors} disabled={isPending} />
      </Section>

      {formError && (
        <div
          className="w-full typography-caption-sm-regular text-state-error"
          role={alertRole}
          aria-live={ariaLivePolite}
        >
          {formError}
        </div>
      )}

      <div className="flex items-center gap-m4">
        <Button
          variant="secondary-action"
          text={t('hackathons.create.actions.cancel')}
          onClick={handleCancel}
          disabled={isPending}
          type="button"
        />
        <Button
          variant="action"
          text={t('hackathons.create.actions.submit')}
          type="submit"
          disabled={isPending}
        />
      </div>
    </form>
  )
}
