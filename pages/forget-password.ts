import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { NoCaptcha } from '~/utils/captcha'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'

import Document from '~/components/document'
import template from './forget-password.pug'

interface ForgetPasswordState {
  states: Dictionary<FormState>
  errorMessage: string
}

@connect(mapState)
class ForgetPassword extends Component<ConnectedProps, ForgetPasswordState> {
  accountApi: AccountApi
  form = new SimpleFormRef()
  captcha: NoCaptcha;

  getInitialState() {
    const states: Dictionary<FormState> = {
      username: {
        label: '',
        placeholder: '用户名',
        rules: [
          { required: true, message: '请输入用户名' },
        ],
      },
    }
    return { states }
  }

  componentDidMount() {
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
    this.accountApi.getResetToken(
      values.username,
      csessionid,
      scene,
      sig,
      captchaToken,
    ).subscribe(
      ({ token }) => router.push(`/reset-password?token=${ token }`),
      ({ retMsg }: ApiResult) => {
        this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
        this.captcha.reload()
      },
    )
  }

  render() {
    return template.call(this, { ...this, Document, SimpleForm })
  }
}

export default ForgetPassword
