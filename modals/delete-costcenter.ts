import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import CostcenterApi from '~/apis/costcenter'
import { Costcenter } from '~/models/costcenter'

import template from './delete-costcenter.pug'

interface DeleteCostcenterProps {
  costcenter: Costcenter
}

@connect(mapState)
export class DeleteCostcenter extends ModalComponent<ConnectedProps & DeleteCostcenterProps> {
  @autobind()
  onClose() {
    const costcenterApi = new CostcenterApi()
    return costcenterApi.deleteCostcenter(this.props.costcenter.id).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default DeleteCostcenter
