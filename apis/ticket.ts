/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Category, CreateTicketData, Ticket, TicketMessage, TicketStatus } from '~/models/ticket'

@CommonApiClass
class TicketApi extends Api {
  createReply(ticketId: string, desc: string): Observable<TicketMessage> {
    return this.axios.post(`/ticket/${ ticketId }/request`, { desc }) as any
  }

  createTicket(data: CreateTicketData): Observable<Ticket> {
    return this.axios.post('/ticket', data) as any
  }

  getTicket(id: string): Observable<Ticket> {
    return this.axios.get(`/ticket/${ id }`) as any
  }

  getTicketCategory(id: string): Observable<string[]> {
    return this.axios.get(`/ticket/${ id }/question_type`) as any
  }

  listCategory(): Observable<Category[]> {
    return this.axios.get('/question') as any
  }

  listSubCategory(categoryId?: string): Observable<Category[]> {
    const params = { question_id: categoryId }
    return this.axios.get('/subquestion', { params }) as any
  }

  listTicket(params?: PageQuery): Observable<PageResult<Ticket>> {
    return this.axios.get('/tickets', { params }) as any
  }

  rateTicket(id: string, star: number, reason: string): Observable<void> {
    return this.axios.post(`/ticket/${ id }/comment`, { star, reason }) as any
  }

  updateTicketStatus(id: string, status: TicketStatus, messageId?: string): Observable<void> {
    return this.axios.patch(`/ticket/${ id }/status`, { status, msg_id: messageId }) as any
  }

  uploadFile(messageId: string, file: Blob): Observable<void> {
    const fileData = new FormData
    fileData.append('files', file)
    return this.axios.post(`/message/${ messageId }/image`, fileData) as any
  }
}

export default TicketApi
