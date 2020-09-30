import { AccountRole } from '~/models/account'
import { ModuleMenu, MENU_COLOR } from './common'

export default {
  label: '首页',
  icon: 'home',
  path: '/',
  role: AccountRole.Admin,
  color: MENU_COLOR.home,
} as ModuleMenu
