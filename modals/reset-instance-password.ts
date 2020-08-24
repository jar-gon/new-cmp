import { connect } from 'react-redux/es'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import SimpleForm, { InputAddition } from '@billyunq/react-utils/simple-form'
import { equalWith } from '@billyunq/react-utils/form/validators'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'
import { tap } from 'rxjs/operators'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { changePower } from './change-instance-power'
import { password } from '~/utils/validators'

import InstanceApi from '~/apis/instance'
import { CloudProvider } from '~/models/common'
import { Instance } from '~/models/instance'

import template from './reset-instance-password.pug'

interface ResetInstancePasswordProps {
  cloud: CloudProvider
  endpointId: string
  regionId: string
  instance: Instance
  triggerUpdate: () => void
}

@connect(mapState)
class ResetInstancePassword extends SimpleFormModalComponent<ConnectedProps & ResetInstancePasswordProps> {
  warning = this.isWarning()
  restart: boolean

  getFormStates() {
    const { getFieldValue } = this.form
    return {
      password: {
        label: '新密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入新密码' },
          { validator: password(), message: '密码应为8-32位，数字、大小写字母、符号至少三种字符的组合' },
        ],
        addition: {
          maxlength: 32,
        } as InputAddition,
      },
      password2: {
        label: '确认密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
          { validator: equalWith(() => getFieldValue('password')), message: '两次密码输入不一致' },
        ],
        addition: {
          maxlength: 32,
        } as InputAddition,
      },
    }
  }

  getOkButtonProps() {
    const props = super.getOkButtonProps()
    props.disabled = this.isWarning()
    return props
  }

  isWarning(): boolean {
    const { instance } = this.props
    return [ 'Starting', 'Running' ].includes(instance.Status)
  }

  @autobind()
  setRestart({ target: { checked } }: CheckboxChangeEvent): void {
    const { okButtonProps } = this.modal.props
    this.restart = checked
    okButtonProps.disabled = this.warning && !this.restart
    this.modal.update()
  }

  @autobind()
  onClose(values: Dictionary) {
    const { cloud, endpointId, regionId, instance, triggerUpdate } = this.props
    const instanceApi = new InstanceApi()
    return instanceApi.resetPassword(instance.InstanceId, endpointId, regionId, values.password).pipe(
      appendTask(this.getTitle()),
      tap(() => {
        if (this.restart) {
          changePower(cloud, endpointId, regionId, instance, 'reboot', instanceApi, triggerUpdate).subscribe()
        }
      })
    )
  }

  render() {
    return template.call(this, { ...this, SimpleForm })
  }
}

export default ResetInstancePassword
