import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { SelectAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { extractKeyToArray } from '~/utils/array'

import CostcenterApi from '~/apis/costcenter'
import MemberApi from '~/apis/member'
import ResourceGroupApi from '~/apis/resource-group'
import { Costcenter } from '~/models/costcenter'
import { Member } from '~/models/member'
import { RelationType } from '~/models/relation'
import { mapArray, parsePageData } from '~/utils/api'

interface RelateResourceGroupProps {
  type: RelationType
  relation: Costcenter & Member
}

@connect(mapState)
export class RelateResourceGroup extends SimpleFormModalComponent<ConnectedProps & RelateResourceGroupProps> {
  getFormStates() {
    const { type, relation } = this.props
    const isCostcenter = type === 'costcenter'
    const value = isCostcenter ? relation.list : relation.projects
    const resourceGroupApi = new ResourceGroupApi()
    return {
      name: {
        label: isCostcenter ? '成本中心名' : '成员名',
        value: isCostcenter ? relation.name : relation.username,
        type: 'text',
      },
      resourceGroupIds: {
        label: '选择资源组',
        value: extractKeyToArray(value, 'id'),
        type: 'select',
        addition: {
          allowClear: true,
          mode: 'multiple',
          dataFrom: resourceGroupApi.listResourceGroup({ pagesize: -1 }).pipe(parsePageData, mapArray(x => ({ label: x.name, value: x.id }))),
        } as SelectAddition,
      }
    }
  }

  getFormProps() {
    return {
      hideRequiredMark: true,
    }
  }

  @autobind()
  onClose(values) {
    const { type, relation } = this.props
    const relationApi = type === 'costcenter' ? new CostcenterApi() : new MemberApi()
    return relationApi.relateResourceGroup(relation.id, values.resourceGroupIds).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default RelateResourceGroup
