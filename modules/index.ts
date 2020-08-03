import { browser } from '@billyunq/react-utils/common'

import { store } from '~/utils/redux'

import { ModuleMenu } from './common'
import HOME_MENUS from './home'
import CLOUD_MENUS from './cloud'
import INSTANCE_MENUS from './instance'
import EXPENSE_MENUS from './expense'
import ORGANIZATION_MENUS from './organization'
import FINANCE_MENUS from './finance'
import OPERATE_MENUS from './operate'
import TICKET_MENUS from './ticket'

export const menus: ModuleMenu[] = [
  HOME_MENUS,
  CLOUD_MENUS,
  INSTANCE_MENUS,
  EXPENSE_MENUS,
  ORGANIZATION_MENUS,
  FINANCE_MENUS,
  OPERATE_MENUS,
  TICKET_MENUS,
]

if (browser) {
  menus.forEach(menu => {
    menu.paths = menu.paths || [ ]
    if (menu.menus) {
      menu.menus.forEach(submenu => submenu.paths = submenu.paths ? [ submenu.path, ...submenu.paths ] : [ submenu.path ])
    }
    if (menu.path) {
      menu.paths = [ menu.path, ...menu.paths ]
      if (menu.menus) {
        menu.menus.forEach(submenu => {
          submenu.path = menu.path + submenu.path
          submenu.paths = submenu.paths.map(x => menu.path + x)
        })
      }
    }
  })
}

export function isMenuAccessible({ role }: ModuleMenu): boolean {
  const { account } = store.default.getState()
  return (!role || role >= account.role)
}

export function isCurrentMenu(menu: ModuleMenu): boolean {
  const { pathname } = window.location
  if (menu.paths.includes(pathname)) {
    return true
  }
  if (!menu.exact) {
    if (pathname.startsWith(`${ menu.path }/`)) {
      return true
    }
    if (menu.menus && menu.menus.some(({ path, paths }) => paths.includes(pathname) || pathname.startsWith(`${ path }/`))) {
      return true
    }
  }
  return false
}

export function getCurrentMenu(): ModuleMenu {
  const pathname = `/${ window.location.pathname.split('/')[1] }`
  return menus.find(({ paths }) => paths.includes(pathname))
}
