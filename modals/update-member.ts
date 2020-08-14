import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { mobile, email } from '~/utils/validators'

import MemberApi from '~/apis/member'
import { Member } from '~/models/member'

interface UpdateMemberProps {
  member: Member
}

@connect(mapState)
export class UpdateMember extends SimpleFormModalComponent<ConnectedProps & UpdateMemberProps> {
  getFormStates() {
    const { member } = this.props
    return {
      username: {
        label: '用户名',
        value: member.username,
        type: 'text',
      },
      mobile: {
        label: '手机',
        value: member.mobile,
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
        value: member.email,
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

  @autobind()
  onClose(values) {
    const { member } = this.props
    const data = {
      mobile: values.mobile,
      email: values.email,
    } as Member
    const memberApi = new MemberApi()
    return memberApi.updateMember(member.id, data).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default UpdateMember
