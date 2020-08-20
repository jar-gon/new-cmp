// export interface Category {
//   id: string
//   question: string
// }

export interface SubCategory {
  id: string
  subquestion: string
  // ticket_type: SubCategoryType
}

export interface Ticket {
  id: string
  // msg_id: string
  question: string
  subquestion: string
  desc: string
  // message: TicketMessage[]
  status: TicketStatus
  created_at: string
  last_update: string
}

// export interface TicketMessage {
//   msg_id: string
//   question: string[]
//   username: string
//   type: TicketMessageType
//   role_type: TicketMessageRoleType
//   message: string
//   url: string[]
//   created_at: string
//   other_desc: TicketMessageIcpDescription
// }

// export interface TicketMessageIcpDescription {
//   cash_type: string
//   domain_name: string
//   host_id: string
//   region_info: string
// }

// export enum SubCategoryType {
//   normal,
//   filing,
// }

export enum TicketStatus {
  Closed = 1,
  Submitted,
  Submitting,
  Replied,
  Completed,
}

// export enum TicketMessageRoleType {
//   User,
//   Responder,
// }

// export enum TicketMessageType {
//   Close,
//   Create,
//   Rate,
//   Complete,
//   Reply,
//   Submit,
//   Transfer,
// }
