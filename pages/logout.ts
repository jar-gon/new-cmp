import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { getQueryParams, buildUrl } from '@billyunq/react-utils/common'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage } from '~/utils/storage'

import AccountApi from '~/apis/account'

@connect(mapState)
class Logout extends Component<ConnectedProps> {
  componentDidMount() {
    if (storage.token) {
      const accountApi = new AccountApi()
      accountApi.logout(storage.token).subscribe(() => {
        storage.token = null
        this.redirectFromLogout()
      })
    } else {
      this.redirectFromLogout()
    }
  }

  redirectFromLogout(): void {
    const { redirect } = getQueryParams()
    const url = buildUrl({
      path: '/login',
      query: redirect && { redirect },
    })
    router.replace(url)
  }

  render() {
    return null
  }
}

export default Logout
