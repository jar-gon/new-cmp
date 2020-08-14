import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputPasswordAddition, InputAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { mobile, email, password } from '~/utils/validators'
import { appendTask } from '~/utils/task'

import MemberApi from '~/apis/member'
import { AccountRole } from '../models/account'
import { CreateMemberData } from '~/models/member'

@connect(mapState)
export class CreateMember extends SimpleFormModalComponent<ConnectedProps> {
  getFormStates() {
    return {
      username: {
        label: '用户名',
        rules: [
          { required: true, message: '请输入用户名' },
          { min: 5, message: '用户名长度为5-32个字符' },
          { max: 32, message: '用户名长度为5-32个字符' },
          { pattern: /^[a-z][a-z0-9]+$/i, message: '用户名只能包含字母和数字，必须要以字母开头' },
        ],
        addition: {
          maxlength: 32,
        } as InputAddition,
      },
      mobile: {
        label: '手机',
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
        rules: [
          { required: true, message: '请输入有效的邮箱地址' },
          { pattern: email, message: '请输入有效的邮箱地址' },
        ],
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
    const member: CreateMemberData = {
      username: values.username,
      mobile: values.mobile,
      email: values.email,
      password: values.password,
      reset: values.reset || false,
      role: AccountRole.Admin,
    }
    const memberApi = new MemberApi()
    return memberApi.createMember(member).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default CreateMember
