/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Bill, BillOrder } from '~/models/bill'

@CommonApiClass
class BillApi extends Api {
  getBill(billId: string, currentMonth: boolean): Observable<Bill> {
    const params = { current_month: currentMonth }
    return this.axios.get(`/bill/${ billId }/detail`, { params }) as any
  }

  listBill(params?: PageQuery): Observable<PageResult<Bill>> {
    return this.axios.get('/bill', { params }) as any
  }

  listBillOrder(billId: string, params: PageQuery): Observable<PageResult<BillOrder>> {
    return this.axios.get(`/bill/${ billId }/orders`, { params }) as any
  }

  openInvoice(billId: string, invoiceId: string): Observable<void> {
    return this.axios.patch(`/bill/${ billId }/invoice`, { invoice_id: invoiceId }) as any
  }
}

export default BillApi
