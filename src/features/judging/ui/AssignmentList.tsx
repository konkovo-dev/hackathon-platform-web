'use client'

import { useState } from 'react'
import { Button, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { EvaluationFormModal } from './EvaluationFormModal'
import type { AssignmentWithSubmission } from '@/entities/judging/api/getMyAssignments'
import type { EvaluationWithSubmission } from '@/entities/judging/api/getMyEvaluations'
import { cn } from '@/shared/lib/cn'

interface Props {
  hackathonId: string
  assignments: AssignmentWithSubmission[]
  evaluations: EvaluationWithSubmission[]
}

export function AssignmentList({ hackathonId, assignments, evaluations }: Props) {
  const t = useT()
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubmission | null>(
    null
  )

  const evaluationBySubmissionId = new Map(
    evaluations.filter(e => e.evaluation?.submissionId).map(e => [e.evaluation!.submissionId!, e])
  )

  const getExistingEvaluation = (assignment: AssignmentWithSubmission) => {
    const submissionId = assignment.assignment?.submissionId
    if (!submissionId) return null
    return evaluationBySubmissionId.get(submissionId) ?? null
  }

  if (assignments.length === 0) {
    return (
      <p className="typography-body-md text-text-secondary py-m8">
        {t('hackathons.judging.list.empty')}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-m4">
        {assignments.map((assignment, idx) => {
          const submissionId = assignment.assignment?.submissionId ?? `row-${idx}`
          const isEvaluated = assignment.assignment?.isEvaluated === true
          const title =
            assignment.submissionTitle ?? t('hackathons.judging.modal.unknown_submission')
          const ownerKind = assignment.submissionOwnerKind
          const ownerLabel =
            ownerKind === 'OWNER_KIND_TEAM'
              ? t('hackathons.judging.owner.team')
              : t('hackathons.judging.owner.individual')

          return (
            <ListItem
              key={submissionId}
              variant="bordered"
              className="min-w-0"
              text={title}
              textClassName="truncate"
              subtitle={ownerLabel}
              rightContent={
                <div className="flex items-center gap-m4 shrink-0">
                  <span
                    className={cn(
                      'typography-caption-sm-regular px-m3 py-m1 rounded-full',
                      isEvaluated
                        ? 'bg-state-success/15 text-state-success'
                        : 'bg-state-warning/15 text-state-warning'
                    )}
                  >
                    {isEvaluated
                      ? t('hackathons.judging.badge.evaluated')
                      : t('hackathons.judging.badge.pending')}
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    {isEvaluated
                      ? t('hackathons.judging.list.edit_score')
                      : t('hackathons.judging.list.evaluate')}
                  </Button>
                </div>
              }
            />
          )
        })}
      </div>

      {selectedAssignment && (
        <EvaluationFormModal
          open={true}
          onClose={() => setSelectedAssignment(null)}
          hackathonId={hackathonId}
          assignment={selectedAssignment}
          existingEvaluation={getExistingEvaluation(selectedAssignment)}
        />
      )}
    </>
  )
}
