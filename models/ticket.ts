export interface Category {
  id: string
  question: string
}

export interface CreateTicketData {
  email: string
  mobile: string
  sub_question_id: string
  enable_email: boolean
  enable_sms: boolean
  desc: string
}

export interface Ticket {
  id: string
  msg_id: string
  question: string
  subquestion: string
  desc: string
  message: TicketMessage[]
  status: TicketStatus
  created_at: string
  last_update: string
}

export interface TicketMessage {
  msg_id: string
  question: string[]
  username: string
  type: TicketMessageType
  role_type: TicketMessageRoleType
  message: string
  url: string[]
  created_at: string
}

export enum TicketMessageRoleType {
  User,
  Responder,
}

export enum TicketMessageType {
  Close,
  Create,
  Rate,
  Complete,
  Reply,
  Submit,
  Transfer,
}

export enum TicketStatus {
  Closed = 1,
  Submitted,
  Submitting,
  Replied,
  Completed,
}
