import { Component } from '@billyunq/react-utils/react'

import Header from './header'
import NavMenu from './nav-menu'
import template from './layout.pug'

interface LayoutProps {
  footer: boolean
  nav: boolean
}

class Layout extends Component<LayoutProps> {
  render() {
    return template.call(this, { ...this, Header, NavMenu })
  }
}

export default Layout
