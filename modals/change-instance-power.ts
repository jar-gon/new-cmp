import { connect } from 'react-redux/es'
import { tap } from 'rxjs/operators'
import { ModalComponent } from '@billyunq/react-utils/modal'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendAsyncTask, waitForResult, mapResult } from '~/utils/task'
import { parseData } from '~/utils/api'

import InstanceApi from '~/apis/instance'
import { CloudProvider } from '~/models/common'
import { Instance, PowerAction } from '~/models/instance'

import { ConvertInstanceStatus } from '~/components/converters/instance-status'
import template from './change-instance-power.pug'

export function changePower(cloud: CloudProvider, endpointId: string, regionId: string, instance: Instance, action: PowerAction, instanceApi: InstanceApi, triggerUpdate?: () => void) {
  const params = { cloud, endpoint_id: endpointId, region_id: regionId }
  return instanceApi.changePower(cloud, endpointId, regionId, instance.InstanceId, action).pipe(
    tap(() => {
      switch (action) {
        case 'start':
          instance.Status = 'Starting'
          if (triggerUpdate) {
            triggerUpdate()
          }
          break
        case 'stop':
        case 'reboot':
          instance.Status = 'Stopping'
          if (triggerUpdate) {
            triggerUpdate()
          }
          break
      }
    }),
    appendAsyncTask('主机操作'),
    waitForResult(instanceApi.get(`/instance/${ instance.InstanceId }`, { params }).pipe(
      parseData,
      mapResult((item: Instance) => {
        instance.Status = item.Status
        if (triggerUpdate) {
          triggerUpdate()
        }
        switch (action) {
          case 'start':
          case 'reboot':
            if (item.Status === 'Running') {
              return true
            }
            break
          case 'stop':
            if (item.Status === 'Stopped') {
              return true
            }
            break
        }
        return null
      }),
    )),
  )
}

interface ChangeInstancePowerProps {
  cloud: CloudProvider
  endpointId: string
  regionId: string
  instance: Instance
  action: PowerAction
  triggerUpdate: () => void
}

@connect(mapState)
class ChangeInstancePower extends ModalComponent<ConnectedProps & ChangeInstancePowerProps> {
  actionText: string

  constructor(props) {
    super(props)
    switch (props.action) {
      case 'start':
        this.actionText = '打开'
        break
      case 'stop':
        this.actionText = '关闭'
        break
      case 'reboot':
        this.actionText = '重启'
        break
      default:
        break
    }
    this.setTitle(`${ this.actionText }主机`)
  }

  onClose() {
    const { cloud, endpointId, regionId, instance, action, triggerUpdate } = this.props
    const instanceApi = new InstanceApi()
    return changePower(cloud, endpointId, regionId, instance, action, instanceApi, triggerUpdate)
  }

  render() {
    return template.call(this, { ...this, ConvertInstanceStatus })
  }
}

export default ChangeInstancePower
