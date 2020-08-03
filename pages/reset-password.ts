import router, { withRouter } from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState, InputAddition, wrapItemTemplate } from '@billyunq/react-utils/simple-form'
import { FragmentWrap } from '@billyunq/react-utils/form'
import { equalWith } from '@billyunq/react-utils/form/validators'
import Template from '@billypon/react-template'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { password } from '~/utils/validators'
import { checkCode } from '~/utils/api'
import { TOKEN_NOT_FOUND } from '~/utils/api-errors'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'
import { Account, ResetTokenInfo } from '~/models/account'

import Document from '~/components/document'
import template from './reset-password.pug'

interface ResetPasswordState {
  states: Dictionary<FormState>
  sendTime: number
  errorMessage: string
  account: Account
}

@withRouter
@connect(mapState)
class ResetPassword extends Component<ConnectedProps, ResetPasswordState> {
  accountApi: AccountApi
  form = new SimpleFormRef()
  token: string
  sendInterval: NodeJS.Timeout
  verifyCodeTpl: Template

  componentDidMount() {
    this.token = this.props.router.query.token as string
    if (!this.token) {
      router.push('/forget-password')
      return
    }
    this.accountApi = new AccountApi()
    this.accountApi.getResetTokenInfo(this.token).pipe(
      checkCode(TOKEN_NOT_FOUND, () => router.push('/forget-password'))
    ).subscribe(tokenInfo => {
      this.initFormStates(tokenInfo)
    })
  }

  componentWillUnmount() {
    clearInterval(this.sendInterval)
  }

  initFormStates(tokenInfo: ResetTokenInfo): void {
    const states: Dictionary<FormState> = {
      username: {
        label: '用户名',
        placeholder: '输入用户名',
        value: tokenInfo.username,
        disabled: true,
      },
      mobile: {
        label: '手机号',
        placeholder: '输入手机号',
        value: tokenInfo.mobile,
        disabled: true,
      },
      verifyCode: {
        label: '验证码',
        placeholder: '输入验证码',
        rules: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码必须为6位数字' },
        ],
        addition: {
          maxLength: 6,
        } as InputAddition,
        render: {
          control: wrapItemTemplate(this.verifyCodeTpl),
        },
      },
      newPassword: {
        label: '新密码',
        subtype: 'password',
        placeholder: '请输入新密码',
        rules: [
          { required: true, message: '请输入密码' },
          { validator: password(), message: '密码应为8-32位，数字、大小写字母、符号至少三种字符的组合' },
        ],
      },
      newPassword2: {
        label: '确认新密码',
        subtype: 'password',
        placeholder: '确认新密码',
        rules: [
          { required: true, message: '请输入密码' },
          { validator: equalWith(() => this.form.getFieldValue('newPassword')), message: '两次密码输入不一致' },
        ],
      },
    }
    this.setState({ states }).subscribe()
  }

  @autobind()
  sendVerifyCode(): void {
    this.accountApi.getResetValidateCode(this.token).subscribe(({ seconds }) => {
      this.setState({ sendTime: seconds })
      this.sendInterval = setInterval(() => {
        let { sendTime } = this.state
        sendTime--
        this.setState({ sendTime })
        if (!sendTime) {
          clearInterval(this.sendInterval)
        }
      }, 1000)
    })
  }

  @autobind()
  onSubmit(values) {
    this.form.setLoading(true).subscribe(() => this.setState({ errorMessage: '' }))
    this.accountApi.resetPassword(this.token, values.newPassword, values.verifyCode).subscribe(
      () => router.replace('/login'),
      ({ retMsg }: ApiResult) => this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
    )
  }

  render() {
    return template.call(this, { ...this, Document, SimpleForm, FragmentWrap })
  }
}

export default ResetPassword
