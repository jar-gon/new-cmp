import { AccountRole } from '~/models/account'

export interface ModuleMenu {
  label: string
  icon?: string
  path?: string
  pathAs?: string
  paths?: string[]
  menus?: ModuleMenu[]
  disabled?: boolean
  exact?: boolean
  opened?: boolean
  role?: AccountRole
  color?: string
}

export const MENU_COLOR = {
  home: '247, 147, 30',
  cloud: '21, 176, 88',
  instance: '97, 130, 255',
  expense: '251, 100, 125',
  organization: '30, 179, 247',
  finance: '247, 66, 30',
  operate: '82, 112, 248',
  ticket: '17, 214, 193',
}
