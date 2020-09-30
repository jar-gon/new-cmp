import { AccountRole } from '~/models/account'
import { ModuleMenu, MENU_COLOR } from './common'

export default {
  label: '费用分析',
  icon: 'yq-expense',
  path: '/expense',
  role: AccountRole.Admin,
  color: MENU_COLOR.expense,
} as ModuleMenu
