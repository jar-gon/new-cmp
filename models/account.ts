export interface Account {
  id: string
  username: string
  mobile: string
  email: string
  reset: boolean
  role: AccountRole
  cur_count: number
  max_count: number
}

export enum AccountRole {
  Admin = 2,
  User = 3,
  Member = 4,
}

export interface CreateAccountData {
  username: string
  password: string
  mobile: string
  code: string
}

export interface LoginInfo {
  token: string
  reset: boolean
}

export interface ResetToken {
  token: string
}

export interface ResetTokenInfo {
  username: string
  mobile: string
}

export interface ValidateCode {
  seconds: number
  status: boolean // false=重复发送
}
