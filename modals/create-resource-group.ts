import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputAddition, SelectAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { mapArray, parsePageData } from '~/utils/api'

import EndpointApi from '~/apis/endpoint'
import ResourceGroupApi from '~/apis/resource-group'
import { CreateResourceGroupData } from '../models/resource-group'

@connect(mapState)
export class CreateResourceGroup extends SimpleFormModalComponent<ConnectedProps> {
  getFormStates() {
    const endpointApi = new EndpointApi()
    return {
      endpointId: {
        label: '账号',
        type: 'select',
        rules: [
          { required: true, message: '请选择账号' },
        ],
        addition: {
          allowClear: true,
          dataFrom: endpointApi.listEndpoint({ pagesize: -1 }).pipe(parsePageData, mapArray(x => ({ label: x.name, value: x.id }))),
        } as SelectAddition,
      },
      name: {
        label: '资源组名',
        rules: [
          { required: true, message: '请输入资源组名' },
          { min: 3, message: '资源组名长度为3-12个字符' },
          { max: 12, message: '资源组名长度为3-12个字符' },
          { pattern: /^[a-z][a-z0-9.-]+$/i, message: '资源组名只能包含字母、数字点号(.)和短横线(-)，必须要以字母开头' },
        ],
        addition: {
          maxlength: 12,
        } as InputAddition,
        extraText: '资源组名只能包含字母、数字点号(.)和短横线(-)，必须要以字母开头',
      },
      desc: {
        label: '描述',
        addition: {
          multiline: true,
        } as InputAddition,
      },
    }
  }

  @autobind()
  onClose(values) {
    const resourceGroup: CreateResourceGroupData = {
      endpoint_id: values.endpointId,
      name: values.name,
      desc: values.desc,
    }
    const resourceGroupApi = new ResourceGroupApi()
    return resourceGroupApi.createResourceGroup(resourceGroup).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default CreateResourceGroup
