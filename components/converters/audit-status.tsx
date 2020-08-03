import Icon from 'antd/es/icon'
import Tooltip from 'antd/es/tooltip'
import { AuditStatus } from '~/models/common'

export const AUDIT_STATUS = [ '待审核', '审核中', '已通过', '已驳回' ]

export function ConvertAuditStatus(props: { status: AuditStatus; desc?: string }) {
  return (
    <span>
      { AUDIT_STATUS[props.status - 1] || props.status }
      <Tooltip placement="right" title={ props.desc }>
        <Icon className={ props.status === AuditStatus.Reject ? 'margin-left_4 cursor-pointer' : 'hidden' } type="question-circle" />
      </Tooltip>
    </span>
  )
}
