import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import SimpleForm, { FormStates, InputAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import EndpointApi from '~/apis/endpoint'
import { CloudVendor } from '~/utils/cloud'

import template from './create-endpoint.pug'

interface CreateEndpointProps {
  cloudVendor: CloudVendor
}

@connect(mapState([ 'account' ]))
export class CreateEndpoint extends SimpleFormModalComponent<ConnectedProps & CreateEndpointProps> {
  getFormStates() {
    const { cloudVendor } = this.props
    const states: FormStates = {
      cloud: {
        label: '云厂商',
        value: cloudVendor.provider,
        hidden: true,
      },
      type: {
        label: '账号类型',
        value: 1,
        hidden: true,
      },
      name: {
        label: '账号别名',
        extraText: '账号别名用于标注纳管入CMPlite中的不同云账号。',
        rules: [
          { required: true, message: '请输入账号别名' },
          { max: 32, message: '账号别名最大长度为32个字符' },
        ],
        addition: {
          maxlength: 32,
        } as InputAddition,
      },
      accountId: {
        label: '账号ID',
        rules: [
          { required: true, message: '请输入账号ID' },
          { pattern: /^\d{12,}$/, message: '请输入正确的账号ID' },
        ],
        addition: {
          maxlength: 24,
        } as InputAddition,
      },
      accesskey: {
        label: 'AccessKey',
        rules: [
          { required: true, message: '请输入AccessKey' },
          { pattern: /^[a-z0-9]{10,}$/i, message: '请输入正确的AccessKey' },
        ],
        addition: {
          maxlength: 64,
        } as InputAddition,
      },
      secretkey: {
        label: 'Secretkey',
        rules: [
          { required: true, message: '请输入SecretKey' },
          { pattern: (/^[a-z0-9|/+]{10,}$/i), message: '请输入正确的SecretKey' },
        ],
        addition: {
          maxlength: 64,
        } as InputAddition,
      },
    }
    return states
  }

  @autobind()
  onClose(values) {
    const endpoint = {
      name: values.name,
      cloud: values.cloud,
      type: values.type,
      accountId: values.accountId,
      accesskey: values.accesskey,
      secretkey: values.secretkey,
    }
    const endpointApi = new EndpointApi()
    return endpointApi.createEndpoint(endpoint).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this, SimpleForm })
  }
}

export default CreateEndpoint
