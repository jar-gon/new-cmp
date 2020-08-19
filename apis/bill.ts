/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Bill } from '~/models/bill'

@CommonApiClass
class BillApi extends Api {
  // getBill(billId: string, currentMonth: string): Observable<Bill> {
  //   const params = new HttpParams({ fromObject: { current_month: currentMonth } });
  //   return this.http.get<Bill>(`/bill/${ billId }/detail`, { params });
  // }

  listBill(params?: PageQuery): Observable<PageResult<Bill>> {
    return this.axios.get('/bill', { params }) as any
  }

  // listBillOrder(billId: string, query: PageQuery): Observable<PageResult<Bill>> {
  //   const params = !query ? null : new HttpParams({ fromObject: query });
  //   return this.http.get<PageResult<Bill>>(`/bill/${ billId }/orders`, { params });
  // }

  openInvoice(billId: string, invoiceId: string): Observable<void> {
    return this.axios.patch(`/bill/${ billId }/invoice`, { invoice_id: invoiceId }) as any
  }
}

export default BillApi
