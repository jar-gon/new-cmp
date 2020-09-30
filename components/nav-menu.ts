import router from 'next/router'
import { Component } from '@billyunq/react-utils/react'

import { menus as moduleMenus, isMenuAccessible, isCurrentMenu } from '~/modules/index'
import { ModuleMenu } from '~/modules/common'

import template from './nav-menu.pug'

class NavMenu extends Component {
  menus: ModuleMenu[]
  isCurrentMenu = isCurrentMenu

  constructor(props) {
    super(props)
    this.menus = this.disabledMenu(moduleMenus)
    this.triggerUpdate = this.triggerUpdate.bind(this)
  }

  componentDidMount() {
    router.events.on('routeChangeComplete', this.triggerUpdate)
  }

  componentWillUnmount() {
    router.events.off('routeChangeComplete', this.triggerUpdate)
  }

  disabledMenu(menus: ModuleMenu[]): ModuleMenu[] {
    return menus.map(menu => {
      if (!menu.disabled && !isMenuAccessible(menu)) {
        menu.disabled = true
      }
      return menu
    })
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default NavMenu
