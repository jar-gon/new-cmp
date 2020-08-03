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
    this.menus = this.filterMenu(moduleMenus)
    this.triggerUpdate = this.triggerUpdate.bind(this)
  }

  componentDidMount() {
    router.events.on('routeChangeComplete', this.triggerUpdate)
  }

  componentWillUnmount() {
    router.events.off('routeChangeComplete', this.triggerUpdate)
  }

  filterMenu(menus: ModuleMenu[]): ModuleMenu[] {
    return menus.filter(menu => {
      const accessible = isMenuAccessible(menu)
      if (accessible && menu.menus) {
        menu.menus = this.filterMenu(menu.menus)
        return menu.menus.length
      }
      return accessible
    })
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default NavMenu
