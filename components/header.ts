import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'
import { getQueryParams } from '@billyunq/react-utils/common'

import { mapState, ConnectedProps } from '~/utils/redux'
import { updateAccount, updateAccountPassword } from '~/modals/index'

import { Account } from '~/models/account'

import template from './header.pug'

interface HeaderState {
  redirect: string
}

@connect(mapState([ 'account' ]))
class Header extends Component<ConnectedProps, HeaderState> {
  componentDidMount() {
    const { pathname, search } = window.location
    const query = getQueryParams()
    const redirect = pathname !== '/login' ? pathname + search : query.redirect || ''
    this.setState({ redirect: redirect && `?redirect=${ encodeURIComponent(redirect) }` })
  }

  @autobind()
  updateAccount(account): void {
    updateAccount(account).afterClose.subscribe(data => {
      this.props.dispatch({ type: 'account', value: data })
    })
  }

  @autobind()
  updatePassword(account: Account): void {
    updateAccountPassword(account)
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default Header
