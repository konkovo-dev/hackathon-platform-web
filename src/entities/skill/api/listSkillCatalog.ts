import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/identitySkills.schema'

type ListSkillCatalogRequest = components['schemas']['v1ListSkillCatalogRequest']
type ListSkillCatalogResponse = components['schemas']['v1ListSkillCatalogResponse']

export async function listSkillCatalog(
  params: ListSkillCatalogRequest = {}
): Promise<ListSkillCatalogResponse> {
  return platformFetchJson<ListSkillCatalogResponse>('/v1/skills/list', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
