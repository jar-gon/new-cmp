import { AccountRole } from '~/models/account'
import { ModuleMenu, MENU_COLOR } from './common'

export default {
  label: '财务管理',
  icon: 'property-safety',
  path: '/finance',
  role: AccountRole.Admin,
  color: MENU_COLOR.finance,
  menus: [
    {
      label: '账户充值',
    },
    {
      label: '充值记录',
    },
    {
      label: '订单管理',
    },
    {
      label: '发票管理',
    },
    {
      label: '账单管理',
    },
  ]
} as ModuleMenu
