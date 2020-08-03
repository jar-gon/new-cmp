import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState } from '@billyunq/react-utils/simple-form'
import { browser, getQueryParams } from '@billyunq/react-utils/common'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage, checkLogin } from '~/utils/storage'
import { NoCaptcha } from '~/utils/captcha'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'

import Document from '~/components/document'
import template from './login.pug'

interface LoginState {
  states: Dictionary<FormState>
  errorMessage: string
}

@connect(mapState)
class Login extends Component<ConnectedProps, LoginState> {
  accountApi: AccountApi
  form = new SimpleFormRef()
  captcha: NoCaptcha

  getInitialState() {
    if (!browser) {
      return super.getInitialState()
    }
    const states: Dictionary<FormState> = {
      username: {
        label: '用户名',
        rules: [
          { required: true, message: '请输入用户名' },
        ],
      },
      password: {
        label: '密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
        ],
      },
    }
    return { states }
  }

  componentDidMount() {
    if (checkLogin()) {
      this.redirectFromLogin()
      return
    }
    this.accountApi = new AccountApi()
    this.captcha = new NoCaptcha
  }

  @autobind()
  onSubmit(values) {
    if (!this.captcha.data) {
      this.setState({ errorMessage: '请滑动验证码' })
      return
    }
    const { csessionid, scene, sig, token: captchaToken } = this.captcha.data
    this.form.setLoading(true).subscribe(() => this.setState({ errorMessage: '' }))
    this.accountApi.login(
      values.username,
      values.password,
      csessionid,
      scene,
      sig,
      captchaToken,
    ).subscribe(
      ({ token, reset }) => {
        storage.token = token
        if (reset) {
          router.push('/update-password')
          return
        }
        this.redirectFromLogin()
      },
      ({ retMsg }: ApiResult) => {
        this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
        this.captcha.reload()
      },
    )
  }

  redirectFromLogin(): void {
    let { redirect } = getQueryParams()
    if (!redirect || redirect[0] !== '/') {
      redirect = '/'
    }
    window.location.replace(redirect)
  }

  render() {
    return template.call(this, { ...this, Document, SimpleForm })
  }
}

export default Login
