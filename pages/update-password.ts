import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState } from '@billyunq/react-utils/simple-form'
import { equalWith } from '@billyunq/react-utils/form/validators'
import { browser } from '@billyunq/react-utils/common'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { password } from '~/utils/validators'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'
import { Account } from '~/models/account'

import Document from '~/components/document'
import template from './update-password.pug'

interface UpdatePasswordState {
  states: Dictionary<FormState>
  errorMessage: string
  account: Account
}

@connect(mapState)
class UpdatePassword extends Component<ConnectedProps, UpdatePasswordState> {
  accountApi: AccountApi
  form = new SimpleFormRef()

  getInitialState() {
    if (!browser) {
      return super.getInitialState()
    }
    const states: Dictionary<FormState> = {
      username: {
        label: '用户名',
        placeholder: '用户名',
        disabled: true,
      },
      password: {
        label: '旧密码',
        subtype: 'password',
        placeholder: '请输入旧密码',
        rules: [
          { required: true, message: '请输入密码' },
        ],
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
    return { states }
  }

  componentDidMount() {
    const { setFieldsValue } = this.form
    this.accountApi = new AccountApi()
    this.accountApi.getInfo().subscribe(account => {
      setFieldsValue({ username: account.username })
      this.setState({ account })
    })
  }

  @autobind()
  onSubmit(values) {
    const { account } = this.state
    this.form.setLoading(true).subscribe(() => this.setState({ errorMessage: '' }))
    this.accountApi.updatePassword(account.id, values.password, values.newPassword).subscribe(
      () => router.replace('/logout'),
      ({ retMsg }: ApiResult) => this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
    )
  }

  render() {
    return template.call(this, { ...this, Document, SimpleForm })
  }
}

export default UpdatePassword
