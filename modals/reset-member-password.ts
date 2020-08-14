import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputPasswordAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { password } from '~/utils/validators'

import MemberApi from '~/apis/member'
import { Member } from '~/models/member'

interface ResetMemberPasswordProps {
  member: Member
}

@connect(mapState)
export class ResetMemberPassword extends SimpleFormModalComponent<ConnectedProps & ResetMemberPasswordProps> {
  getFormStates() {
    const { member } = this.props
    return {
      username: {
        label: '用户名',
        value: member.username,
        type: 'text',
      },
      password: {
        label: '密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
          { validator: password(), message: '密码应为8-32位，数字、大小写字母、符号至少三种字符的组合' },
        ],
        addition: {
          maxlength: 32,
          toggle: true,
        } as InputPasswordAddition,
      },
      reset: {
        label: '下次登录修改密码',
        type: 'checkbox',
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
    const { member } = this.props
    const memberApi = new MemberApi()
    return memberApi.resetMemberPassword(member.id, values.password, values.reset).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default ResetMemberPassword
