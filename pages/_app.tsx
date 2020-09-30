import NextApp from 'next/app'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import withRedux, { NextJSAppContext, AppProps } from 'next-redux-wrapper/es6'
import { ConfigProvider } from 'antd/es/index'
import locale from 'antd/es/locale/zh_CN'
import { getLoginUrl } from '@billyunq/react-utils/common'
import '@billyunq/react-utils/axios'

import { initializeStore } from '~/utils/redux'
import { checkLogin } from '~/utils/storage'
import { session } from '~/utils/session'
import { serverRuntimeConfig } from '~/utils/config'
import { getCurrentMenu, isMenuAccessible } from '~/modules/index'

import AccountApi from '~/apis/account'
import { AccountRole } from '~/models/account'

import '~/styles/index.less'
import '~/styles/index.styl'
import '~/icons'

const publicUrls = [
  '/forget-password',
  '/login',
  '/logout',
  '/register',
  '/reset-password',
  '/update-password',
]

function getIsvInfo() {
  /* eslint-disable global-require */
  return {
    name: 'CMPlite｜轻量级多云管理平台',
    keyword: 'CMP,多云管理,运管平台,aliyun,AWS,折扣,阿里云,CMPlite,CMPlite,云权cmp,云权科技cmp,云权CMPlite,云权科技CMPlite',
    description: 'CMPlite云管平台是上海云权科技有限公司旗下重要产品版块组成之一，用户和MSP可实现在统一界面管理多云厂商的资源和服务，快速切换账号和云厂商并跳转至其原生控制台进行操作，从而实现轻量级的多云纳管、统一登录、统一服务。',
    favicon: require('~/assets/favicon.ico'),
    logo: require('~/assets/logo.svg'),
    accountLogo: require('~/assets/account-logo.svg'),
    avatar: require('~/assets/avatar.png'),
    home: serverRuntimeConfig.home,
  }
  /* eslint-enable global-require */
}

class App extends NextApp<AppProps> {
  accepted: boolean

  static async getInitialProps({ Component, ctx }: NextJSAppContext) {
    const { store } = ctx

    store.dispatch({ type: 'isvInfo', value: getIsvInfo() })

    const pageProps = await loadGetInitialProps(Component, ctx)

    return { pageProps }
  }

  componentDidMount() {
    if (publicUrls.includes(window.location.pathname)) {
      this.accepted = true
      this.setState({ })
    } else if (!checkLogin()) {
      window.location.replace(getLoginUrl())
    } else {
      this.getUserInfo()
    }
  }

  getUserInfo(): void {
    const { store } = this.props
    const accountApi = new AccountApi()
    accountApi.getInfo().subscribe(account => {
      session.initialized = true
      store.dispatch({ type: 'account', value: account })
      this.checkRoute()
      this.setState({ })
    })
  }

  checkRoute(): void {
    const { account } = this.props.store.getState()
    const menu = getCurrentMenu()
    if (menu && !isMenuAccessible(menu)) {
      const url = account.role === AccountRole.Admin ? '/' : '/cloud'
      window.location.replace(url)
    }
  }

  render() {
    const { Component, pageProps, store } = this.props
    const { account } = store.getState()
    return account || this.accepted ? (
      <ConfigProvider locale={ locale } autoInsertSpaceInButton={ false }>
        <Provider store={ store }>
          <Component { ...pageProps } />
        </Provider>
      </ConfigProvider>
    ) : <></>
  }
}

export default withRedux(initializeStore)(App)
