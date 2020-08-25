import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { getCloudVendor } from '~/utils/cloud'

import EndpointApi from '~/apis/endpoint'
import { Endpoint } from '~/models/endpoint'

interface UpdateEndpointProps {
  endpoint: Endpoint
}

@connect(mapState)
export class UpdateEndpoint extends SimpleFormModalComponent<ConnectedProps & UpdateEndpointProps> {
  getFormStates() {
    const { endpoint } = this.props
    return {
      name: {
        label: '账号别名',
        value: endpoint.name,
        rules: [
          { required: true, message: '请输入账号别名' },
          { max: 32, message: '账号别名最大长度为32个字符' },
        ],
        addition: {
          maxlength: 32,
        } as InputAddition,
      },
      cloud: {
        label: '云厂商',
        value: getCloudVendor(endpoint.cloud).name,
        type: 'text',
      },
      type: {
        label: '账号类型',
        value: getCloudVendor(endpoint.cloud).type[endpoint.type - 1],
        type: 'text',
      },
      accountId: {
        label: '账号ID',
        value: endpoint.accountId,
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
        value: endpoint.accesskey,
        rules: [
          { required: true, message: '请输入AccessKey' },
          { pattern: /^[a-z0-9]{10,}$/i, message: '请输入正确的AccessKey' },
        ],
        addition: {
          maxlength: 64,
        } as InputAddition,
      },
      secretkey: {
        label: 'SecretKey',
        rules: [
          { required: true, message: '请输入Accesskey' },
          { pattern: /^[a-z0-9|/+]{10,}$/i, message: '请输入正确的Accesskey' },
        ],
        addition: {
          maxlength: 64,
        } as InputAddition,
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
    const { endpoint } = this.props
    const data = {
      name: values.name,
      accountId: values.accountId,
      accesskey: values.accesskey,
      secretkey: values.secretkey,
    } as Endpoint
    const endpointApi = new EndpointApi()
    return endpointApi.updateEndpoint(endpoint.id, data).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default UpdateEndpoint
