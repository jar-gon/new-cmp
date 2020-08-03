import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { equalWith } from '@billyunq/react-utils/form/validators'
import { InputPasswordAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { password } from '~/utils/validators'

import AccountApi from '~/apis/account'
import { Account } from '~/models/account'

interface UpdateAccountPasswordProps {
  account: Account
}

@connect(mapState)
export class UpdateAccountPassword extends SimpleFormModalComponent<ConnectedProps & UpdateAccountPasswordProps> {
  getFormStates() {
    const { account } = this.props
    const { getFieldValue } = this.form
    return {
      username: {
        label: '用户名',
        value: account.username,
        type: 'text',
      },
      oldPassword: {
        label: '旧密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入旧密码' },
        ],
        addition: {
          maxlength: 32,
          toggle: true,
        } as InputPasswordAddition,
      },
      newPassword: {
        label: '新密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入新密码' },
          { validator: password(), message: '密码应为8-32位，数字、大小写字母、符号至少三种字符的组合' },
        ],
        addition: {
          maxlength: 32,
          toggle: true,
        } as InputPasswordAddition,
      },
      newPassword2: {
        label: '确认密码',
        placeholder: '确认新密码',
        subtype: 'password',
        rules: [
          { validator: equalWith(() => getFieldValue('newPassword')), message: '两次密码输入不一致' },
        ],
        addition: {
          maxlength: 32,
          toggle: true,
        } as InputPasswordAddition,
      },
    }
  }

  getFormProps() {
    return {
      hideRequiredMark: true,
    }
  }

  @autobind()
  onClose(values) {
    const { account } = this.props
    const accountApi = new AccountApi()
    return accountApi.updatePassword(account.id, values.oldPassword, values.newPassword).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default UpdateAccountPassword
