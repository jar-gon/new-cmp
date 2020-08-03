import { ModuleMenu, MENU_COLOR } from './common'

export default {
  label: '组织管理',
  icon: 'yq-organization',
  path: '/organization',
  color: MENU_COLOR.organization,
  menus: [
    {
      label: '成本中心管理',
    },
    {
      label: '资源组管理',
    },
    {
      label: '成员管理',
    },
    {
      label: '关联展示',
    },
  ]
} as ModuleMenu
