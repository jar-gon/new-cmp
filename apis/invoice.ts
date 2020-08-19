/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'
// import { Dictionary } from '@billypon/ts-types'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Invoice } from '~/models/invoice'

@CommonApiClass
class InvoiceApi extends Api {
  // createInvoice(data: Dictionary): Observable<Invoice> {
  //   data.opener_type = 'enterprise'
  //   return this.axios.post('/invoice/info', data) as any
  // }

  deleteInvoice(id: string): Observable<void> {
    return this.axios.delete(`/invoice/info/${ id }`) as any
  }

  // getInvoice(id: string): Observable<Invoice> {
  //   return this.axios.get(`/invoice/info/${ id }`) as any
  // }

  listInvoice(params?: PageQuery): Observable<PageResult<Invoice>> {
    return this.axios.get('/invoice/info', { params }) as any
  }

  // openInvoice(billId: string, invoiceId: string): Observable<void> {
  //   return this.axios.patch(`/bill/${ billId }/invoice`, { invoice_id: invoiceId }) as any
  // }

  // updateInvoice(id: string, data: Dictionary): Observable<Invoice> {
  //   data.opener_type = 'enterprise'
  //   return this.axios.patch(`/invoice/info/${ id }`, data) as any
  // }
}

export default InvoiceApi
