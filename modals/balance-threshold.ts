import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import { InputNumberAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import FinanceApi from '~/apis/finance'
import { Balance } from '~/models/finance'

interface BalanceThresholdProps {
  quota: number
}

@connect(mapState)
export class BalanceThreshold extends SimpleFormModalComponent<ConnectedProps & BalanceThresholdProps> {
  getFormStates() {
    return {
      quota: {
        label: '余额阈值',
        value: this.props.quota,
        type: 'input-number',
        rules: [
          { required: true, message: '请输入余额阈值' },
        ],
        addition: {
          min: 0,
          max: 9999,
        } as InputNumberAddition,
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
    const data = {
      quota: values.quota,
    } as Balance
    const financeApi = new FinanceApi()
    return financeApi.balanceThreshold(data.quota.toString()).pipe(
      appendTask(this.getTitle()),
    )
  }
}

export default BalanceThreshold
