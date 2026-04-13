'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, InputLabel, TextareaLabel, Section } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useSubmitEvaluationMutation } from '../model/hooks'
import { useSubmissionDetailQuery } from '@/entities/submission/model/hooks'
import { ViewSubmissionContent } from '@/features/submission/ui/ViewSubmissionModal'
import type { AssignmentWithSubmission } from '@/entities/judging/api/getMyAssignments'
import type { EvaluationWithSubmission } from '@/entities/judging/api/getMyEvaluations'

interface Props {
  open: boolean
  onClose: () => void
  hackathonId: string
  assignment: AssignmentWithSubmission
  existingEvaluation: EvaluationWithSubmission | null
}

export function EvaluationFormModal({
  open,
  onClose,
  hackathonId,
  assignment,
  existingEvaluation,
}: Props) {
  const t = useT()
  const submissionId = assignment.assignment?.submissionId ?? ''

  const [score, setScore] = useState('')
  const [comment, setComment] = useState('')
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: submissionDetail, isLoading: submissionDetailLoading } = useSubmissionDetailQuery(
    hackathonId,
    submissionId || null,
    open && !!submissionId
  )

  const submitMutation = useSubmitEvaluationMutation(hackathonId)

  // Pre-fill from existing evaluation when modal opens
  useEffect(() => {
    if (open) {
      if (existingEvaluation?.evaluation) {
        setScore(String(existingEvaluation.evaluation.score ?? ''))
        setComment(existingEvaluation.evaluation.comment ?? '')
      } else {
        setScore('')
        setComment('')
      }
      setScoreError(null)
      setCommentError(null)
      setSubmitError(null)
    }
  }, [open, existingEvaluation])

  const handleClose = () => {
    if (submitMutation.isPending) return
    onClose()
  }

  const validate = (): boolean => {
    let valid = true
    const scoreNum = Number(score)
    if (
      score === '' ||
      isNaN(scoreNum) ||
      scoreNum < 0 ||
      scoreNum > 10 ||
      !Number.isInteger(scoreNum)
    ) {
      setScoreError(t('hackathons.judging.errors.score_invalid'))
      valid = false
    } else {
      setScoreError(null)
    }
    if (!comment.trim() || comment.trim().length < 1 || comment.trim().length > 5000) {
      setCommentError(t('hackathons.judging.errors.comment_required'))
      valid = false
    } else {
      setCommentError(null)
    }
    return valid
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitError(null)
    try {
      await submitMutation.mutateAsync({
        submissionId,
        score: Number(score),
        comment: comment.trim(),
      })
      onClose()
    } catch {
      setSubmitError(t('hackathons.judging.errors.submit_failed'))
    }
  }

  const title = assignment.submissionTitle ?? t('hackathons.judging.modal.unknown_submission')
  const ownerKind = assignment.submissionOwnerKind
  const workSectionTitle =
    ownerKind === 'OWNER_KIND_TEAM'
      ? t('hackathons.judging.modal.work_section_title_team')
      : t('hackathons.judging.modal.work_section_title_individual')

  const lastEditedAt =
    existingEvaluation?.evaluation?.updatedAt ?? existingEvaluation?.evaluation?.evaluatedAt

  return (
    <Modal open={open} onClose={handleClose} title={t('hackathons.judging.modal.title')} size="lg">
      <Section
        variant="outlined"
        title={workSectionTitle}
        className="max-h-[min(50vh,28rem)] overflow-y-auto"
      >
        <div className="flex flex-col gap-m4">
          <span className="typography-body-md-medium text-text-primary">{title}</span>
          {submissionId ? (
            submissionDetailLoading ? (
              <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
            ) : submissionDetail ? (
              <ViewSubmissionContent hackathonId={hackathonId} submission={submissionDetail} />
            ) : null
          ) : null}
        </div>
      </Section>

      {/* Last evaluated timestamp */}
      {lastEditedAt && (
        <p className="typography-caption-sm-regular text-text-tertiary">
          {t('hackathons.judging.modal.last_edited')} {new Date(lastEditedAt).toLocaleString()}
        </p>
      )}

      <div className="flex flex-col gap-m2">
        <InputLabel
          label={t('hackathons.judging.modal.score_label')}
          inputPlaceholder={t('hackathons.judging.modal.score_placeholder')}
          inputType="number"
          inputId="judging-evaluation-score"
          error={!!scoreError}
          className="gap-m2"
          inputProps={{
            min: 0,
            max: 10,
            step: 1,
            value: score,
            onChange: e => setScore(e.target.value),
          }}
        />
        {scoreError && (
          <p className="typography-caption-sm-regular text-state-error">{scoreError}</p>
        )}
      </div>

      <div className="flex flex-col gap-m2">
        <TextareaLabel
          label={t('hackathons.judging.modal.comment_label')}
          textareaPlaceholder={t('hackathons.judging.modal.comment_placeholder')}
          textareaId="judging-evaluation-comment"
          error={!!commentError}
          className="gap-m2"
          textareaProps={{
            value: comment,
            onChange: e => setComment(e.target.value),
            rows: 4,
          }}
        />
        {commentError && (
          <p className="typography-caption-sm-regular text-state-error">{commentError}</p>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <p className="typography-caption-sm-regular text-state-error">{submitError}</p>
      )}

      {/* Footer actions */}
      <div className="flex justify-end gap-m4 pt-m2">
        <Button
          variant="secondary"
          size="md"
          onClick={handleClose}
          disabled={submitMutation.isPending}
        >
          {t('hackathons.judging.modal.cancel')}
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending
            ? t('hackathons.judging.modal.submitting')
            : t('hackathons.judging.modal.submit')}
        </Button>
      </div>
    </Modal>
  )
}
