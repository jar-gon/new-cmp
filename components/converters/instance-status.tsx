import { InstanceStatus } from '~/models/instance'
import { STATUS_CLASS } from './common'

export function ConvertInstanceStatus(props: { status: InstanceStatus }) {
  let statusName: string
  let className: string
  switch (props.status) {
    case 'Starting':
      statusName = '启动中'
      className = STATUS_CLASS.warning
      break
    case 'Running':
      statusName = '运行中'
      className = STATUS_CLASS.success
      break
    case 'Stopping':
      statusName = '停止中'
      className = STATUS_CLASS.warning
      break
    case 'Stopped':
      statusName = '已停止'
      className = STATUS_CLASS.default
      break
    default:
      return props.status
  }
  return <span className={ className }>{ statusName }</span>
}
