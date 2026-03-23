'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Section } from '@/shared/ui/Section'
import { PageContainer } from '@/shared/ui/PageContainer'
import { Button } from '@/shared/ui/Button'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { MarkdownEditor } from '@/shared/ui/MarkdownEditor'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { ApiError } from '@/shared/api/errors'
import { localizeValidationError } from '@/shared/lib/validation/localizeValidationError'
import { isoToDatetimeLocal } from '@/shared/lib/formatDate'
import {
  prefetchHackathonPageData,
  useCreateHackathonMutation,
} from '@/features/hackathon-create/model/hooks'
import { useUpdateHackathonMutation } from '@/features/hackathon-edit/model/hooks'
import {
  validateHackathonForm,
  type FieldErrors,
} from '@/features/hackathon-create/model/validation'
import { BasicInfoSection } from '@/features/hackathon-create/ui/BasicInfoSection'
import { LocationSection } from '@/features/hackathon-create/ui/LocationSection'
import { DatesSection } from '@/features/hackathon-create/ui/DatesSection'
import { RegistrationPolicySection } from '@/features/hackathon-create/ui/RegistrationPolicySection'
import { LimitsSection } from '@/features/hackathon-create/ui/LimitsSection'
import { LinksSection, type LinkItem } from '@/features/hackathon-create/ui/LinksSection'
import type { CreateHackathonRequest } from '@/features/hackathon-create/api/createHackathon'
import type { UpdateHackathonRequest } from '@/features/hackathon-edit/api/updateHackathon'
import type { Hackathon } from '@/entities/hackathon/model/types'

interface HackathonFormProps {
  mode: 'create' | 'edit'
  hackathonId?: string
  initialData?: Hackathon
}

export function HackathonForm({ mode, hackathonId, initialData }: HackathonFormProps) {
  const t = useT()
  const router = useRouter()
  const queryClient = useQueryClient()
  const createMutation = useCreateHackathonMutation()
  const updateMutation = useUpdateHackathonMutation()

  const isEditMode = mode === 'edit'
  const mutation = isEditMode ? updateMutation : createMutation

  const [name, setName] = useState(initialData?.name || '')
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '')
  const [description, setDescription] = useState(initialData?.description || '')

  const [city, setCity] = useState(initialData?.location?.city || '')
  const [venue, setVenue] = useState(initialData?.location?.venue || '')
  const [online, setOnline] = useState(initialData?.location?.online || false)

  const [startsAt, setStartsAt] = useState(isoToDatetimeLocal(initialData?.dates?.startsAt))
  const [endsAt, setEndsAt] = useState(isoToDatetimeLocal(initialData?.dates?.endsAt))
  const [registrationOpensAt, setRegistrationOpensAt] = useState(
    isoToDatetimeLocal(initialData?.dates?.registrationOpensAt)
  )
  const [registrationClosesAt, setRegistrationClosesAt] = useState(
    isoToDatetimeLocal(initialData?.dates?.registrationClosesAt)
  )
  const [submissionsOpensAt, setSubmissionsOpensAt] = useState(
    isoToDatetimeLocal(initialData?.dates?.submissionsOpensAt)
  )
  const [submissionsClosesAt, setSubmissionsClosesAt] = useState(
    isoToDatetimeLocal(initialData?.dates?.submissionsClosesAt)
  )
  const [judgingEndsAt, setJudgingEndsAt] = useState(
    isoToDatetimeLocal(initialData?.dates?.judgingEndsAt)
  )

  const [allowIndividual, setAllowIndividual] = useState(
    initialData?.registrationPolicy?.allowIndividual ?? true
  )
  const [allowTeam, setAllowTeam] = useState(initialData?.registrationPolicy?.allowTeam ?? true)

  const [teamSizeMax, setTeamSizeMax] = useState(
    initialData?.limits?.teamSizeMax ? String(initialData.limits.teamSizeMax) : ''
  )

  const [links, setLinks] = useState<LinkItem[]>(
    initialData?.links && initialData.links.length > 0
      ? initialData.links
          .map(link => ({
            title: link.title ?? '',
            url: link.url ?? '',
          }))
          .filter(link => link.title && link.url)
      : [{ title: '', url: '' }]
  )

  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isPending = mutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const validation = validateHackathonForm({ name })
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      setFormError(
        validation.message ||
          t(isEditMode ? 'hackathons.edit.errors.unknown' : 'hackathons.create.errors.required')
      )
      return
    }

    const basePayload: any = {
      name: name.trim(),
    }

    if (shortDescription.trim()) {
      basePayload.shortDescription = shortDescription.trim()
    }

    if (description.trim()) {
      basePayload.description = description.trim()
    }

    if (city.trim() || venue.trim() || online) {
      basePayload.location = {
        online,
        ...(city.trim() && { city: city.trim() }),
        ...(venue.trim() && { venue: venue.trim() }),
      }
    }

    const dates: any = {}
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
      basePayload.dates = dates
    }

    basePayload.registrationPolicy = {
      allowIndividual,
      allowTeam,
    }

    if (teamSizeMax) {
      const size = parseInt(teamSizeMax, 10)
      if (!isNaN(size) && size > 0) {
        basePayload.limits = { teamSizeMax: size }
      }
    }

    const validLinks = links.filter(link => link.title.trim() && link.url.trim())
    if (validLinks.length > 0) {
      basePayload.links = validLinks.map(link => ({
        title: link.title.trim(),
        url: link.url.trim(),
      }))
    }

    try {
      let response: any

      if (isEditMode && hackathonId) {
        const payload: UpdateHackathonRequest = {
          hackathonId,
          ...basePayload,
        }
        response = await updateMutation.mutateAsync(payload)
      } else {
        const payload: CreateHackathonRequest = {
          ...basePayload,
          state: 'DRAFT',
        }
        response = await createMutation.mutateAsync(payload)
      }

      if (isEditMode) {
        if (!response.validationErrors || response.validationErrors.length === 0) {
          router.push(routes.hackathons.detail(hackathonId!))
          return
        }
      } else {
        if (response.hackathonId) {
          await prefetchHackathonPageData(queryClient, response.hackathonId)
          router.push(routes.hackathons.detail(response.hackathonId))
          return
        }
      }

      if (response.validationErrors && response.validationErrors.length > 0) {
        const errors: FieldErrors = {}
        response.validationErrors.forEach((err: any) => {
          if (err.field) {
            errors[err.field] = true
          }
        })
        setFieldErrors(errors)
        setFormError(
          response.validationErrors.map((err: any) => localizeValidationError(err, t)).join('; ') ||
            t(isEditMode ? 'hackathons.edit.errors.unknown' : 'hackathons.create.errors.unknown')
        )
        return
      }
    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} hackathon error:`, err)
      const api = err instanceof ApiError ? err.data : null
      setFormError(
        (api?.message && api.message.trim()) ||
          t(isEditMode ? 'hackathons.edit.errors.unknown' : 'hackathons.create.errors.unknown')
      )
    }
  }

  const handleCancel = () => {
    if (isEditMode && hackathonId) {
      router.push(routes.hackathons.detail(hackathonId))
    } else {
      router.push(routes.hackathons.list)
    }
  }

  const alertRole = 'alert' as const
  const ariaLivePolite = 'polite' as const

  const breadcrumbItems = [
    {
      label: t('hackathons.breadcrumb.hackathons'),
      href: routes.hackathons.list,
    },
    ...(isEditMode && initialData
      ? [
          {
            label: initialData.name ?? t('common.fallback.hackathon'),
            href: routes.hackathons.detail(hackathonId!),
          },
          {
            label: t('hackathons.breadcrumb.edit'),
          },
        ]
      : [
          {
            label: t('hackathons.breadcrumb.create'),
          },
        ]),
  ]

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="flex flex-col gap-m8">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="typography-heading-lg text-text-primary">
          {t(isEditMode ? 'hackathons.edit.title' : 'hackathons.create.title')}
        </h1>

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
          <Section
            title={t('hackathons.create.sections.registration_policy')}
            className={!allowTeam ? 'col-span-2' : undefined}
          >
            <RegistrationPolicySection
              allowIndividual={allowIndividual}
              setAllowIndividual={setAllowIndividual}
              allowTeam={allowTeam}
              setAllowTeam={setAllowTeam}
              disabled={isPending}
            />
          </Section>

          {allowTeam && (
            <Section title={t('hackathons.create.fields.teamSizeMax')}>
              <LimitsSection
                teamSizeMax={teamSizeMax}
                setTeamSizeMax={setTeamSizeMax}
                errors={fieldErrors}
                disabled={isPending}
              />
            </Section>
          )}
        </div>

        <Section title={t('hackathons.create.sections.links')}>
          <LinksSection
            links={links}
            setLinks={setLinks}
            errors={fieldErrors}
            disabled={isPending}
          />
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
            text={t(
              isEditMode ? 'hackathons.edit.actions.cancel' : 'hackathons.create.actions.cancel'
            )}
            onClick={handleCancel}
            disabled={isPending}
            type="button"
          />
          <Button
            variant="action"
            text={t(
              isEditMode ? 'hackathons.edit.actions.save' : 'hackathons.create.actions.submit'
            )}
            type="submit"
            disabled={isPending}
          />
        </div>
      </form>
    </PageContainer>
  )
}
