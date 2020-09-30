import { AccountRole } from '~/models/account'
import { ModuleMenu, MENU_COLOR } from './common'

export default {
  label: '操作日志',
  icon: 'yq-operate',
  path: '/operate',
  disabled: true,
  role: AccountRole.Admin,
  color: MENU_COLOR.operate,
} as ModuleMenu
