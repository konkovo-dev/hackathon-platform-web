import { UserName } from '@/shared/ui/UserName'
import type { MeUser } from '@/entities/user/model/types'

interface ProfileInfoSectionProps {
  user: MeUser
  editable?: boolean
}

export function ProfileInfoSection({ user }: ProfileInfoSectionProps) {
  return <UserName firstName={user.firstName} lastName={user.lastName} username={user.username} />
}
