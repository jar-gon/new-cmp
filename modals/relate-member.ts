import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { SelectAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { extractKeyToArray } from '~/utils/array'

import MemberApi from '~/apis/member'
import ResourceGroupApi from '~/apis/resource-group'
import { ResourceGroup } from '~/models/resource-group'
import { mapArray, parsePageData } from '~/utils/api'

interface RelateMemberProps {
  resourceGroup: ResourceGroup
}

@connect(mapState)
export class RelateMember extends SimpleFormModalComponent<ConnectedProps & RelateMemberProps> {
  getFormStates() {
    const { resourceGroup } = this.props
    const memberApi = new MemberApi()
    return {
      memberIds: {
        label: '选择成员',
        value: extractKeyToArray(resourceGroup.members, 'id'),
        type: 'select',
        addition: {
          allowClear: true,
          mode: 'multiple',
          dataFrom: memberApi.listMember({ pagesize: -1 }).pipe(parsePageData, mapArray(x => ({ label: x.username, value: x.id }))),
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
    const { resourceGroup } = this.props
    const resourceGroupApi = new ResourceGroupApi()
    return resourceGroupApi.relateMember(resourceGroup.id, values.memberIds).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default RelateMember
