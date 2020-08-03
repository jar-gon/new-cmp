import { EnabledStatus } from '~/models/common'
import { TEXT_CLASS } from './common'

export const ENABLED_STATUS = [ '启用', '禁用' ]

export function ConvertEnabledStatus(props: { status: EnabledStatus }) {
  let className: string
  switch (props.status) {
    case 1:
      className = TEXT_CLASS.success
      break
    case 2:
      className = TEXT_CLASS.default
      break
    default:
      return props.status
  }
  return <span className={ className }>{ ENABLED_STATUS[props.status - 1] }</span>
}
