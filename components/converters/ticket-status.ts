import { TicketStatus } from '~/models/ticket'

const TICKET_STATUS = [ '已关闭', '已提交', '提交中', '已回复', '已完成' ]

export function ConvertTicketStatus(props: { status: TicketStatus }) {
  return TICKET_STATUS[props.status - 1] || props.status
}
