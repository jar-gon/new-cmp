import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputAddition } from '@billyunq/react-utils/simple-form'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { mobile, email } from '~/utils/validators'

import AccountApi from '~/apis/account'
import { Account } from '~/models/account'

interface UpdateAccountProps {
  account: Account
}

@connect(mapState)
export class UpdateAccount extends SimpleFormModalComponent<ConnectedProps & UpdateAccountProps> {
  getFormStates() {
    const { account } = this.props
    return {
      username: {
        label: '用户名',
        value: account.username,
        type: 'text',
      },
      mobile: {
        label: '手机',
        value: account.mobile,
        rules: [
          { required: true, message: '请输入手机号码' },
          { pattern: mobile, message: '请输入正确的手机号码' },
        ],
        addition: {
          maxlength: 11,
        } as InputAddition,
      },
      email: {
        label: '邮箱',
        value: account.email,
        rules: [
          { required: true, message: '请输入有效的邮箱地址' },
          { pattern: email, message: '请输入正确的邮箱' },
        ],
      },
    }
  }

  getFormProps() {
    return {
      hideRequiredMark: true,
    }
  }

  onClose(values) {
    const data = {
      mobile: values.mobile,
      email: values.email,
    } as Account
    const accountApi = new AccountApi()
    return accountApi.updateAccount(data).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default UpdateAccount
