import { TicketStatus } from '~/models/ticket'

export function ConvertTicketStatus(props: { status: TicketStatus }) {
  switch (props.status) {
    case TicketStatus.Closed:
      return '已关闭'
    case TicketStatus.Submitted:
      return '已提交'
    case TicketStatus.Replied:
      return '已回复'
    case TicketStatus.Completed:
      return '已完成'
  }
  return props.status
}
