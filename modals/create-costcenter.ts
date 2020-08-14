import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import CostcenterApi from '~/apis/costcenter'
import { CreateSimpleObject } from '../models/common'

@connect(mapState)
export class CreateCostcenter extends SimpleFormModalComponent<ConnectedProps> {
  getFormStates() {
    return {
      name: {
        label: '成本中心名',
        rules: [
          { required: true, message: '请输入成本中心名' },
          { min: 3, message: '成本中心名长度为3-12个字符' },
          { max: 12, message: '成本中心名长度为3-12个字符' },
          { pattern: /^[a-z][a-z0-9.-]+$/i, message: '成本中心名只能包含字母、数字点号(.)和短横线(-)，必须要以字母开头' },
        ],
        addition: {
          maxlength: 12,
        } as InputAddition,
        extraText: '成本中心名只能包含字母、数字点号(.)和短横线(-)，必须要以字母开头',
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
    const costcenter: CreateSimpleObject = {
      name: values.name,
      desc: values.desc,
    }
    const costcenterApi = new CostcenterApi()
    return costcenterApi.createCostcenter(costcenter).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default CreateCostcenter
