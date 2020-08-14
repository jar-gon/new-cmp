import { Account, AccountRole } from './account'
import { NormalStatus, SimpleObject } from './common'

export interface CreateMemberData {
  username: string
  mobile: string
  email: string
  password: string
  reset: boolean
  role: AccountRole
}

export interface Member extends Account {
  projects: SimpleObject[]
  status: NormalStatus
  created_at: string
  login_at: string
}
