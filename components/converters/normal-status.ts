import { NormalStatus } from '~/models/common'

export const NORMAL_STATUS = [ '正常', '已禁用' ]

export function ConvertNormalStatus(props: { status: NormalStatus }) {
  return NORMAL_STATUS[props.status - 1] || props.status
}
