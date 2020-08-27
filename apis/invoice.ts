/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { CreateInvoiceData, FileData, Invoice } from '~/models/invoice'

@CommonApiClass
class InvoiceApi extends Api {
  createInvoice(invoice: CreateInvoiceData): Observable<Invoice> {
    invoice.opener_type = 'enterprise'
    return this.axios.post('/invoice/info', invoice) as any
  }

  deleteInvoice(id: string): Observable<void> {
    return this.axios.delete(`/invoice/info/${ id }`) as any
  }

  listInvoice(params?: PageQuery): Observable<PageResult<Invoice>> {
    return this.axios.get('/invoice/info', { params }) as any
  }

  updateInvoice(id: string, invoice: CreateInvoiceData): Observable<Invoice> {
    invoice.opener_type = 'enterprise'
    return this.axios.patch(`/invoice/info/${ id }`, invoice) as any
  }

  uploadFile(file: Blob): Observable<FileData> {
    const fileData = new FormData
    fileData.append('files', file)
    return this.axios.post('/invoice/image', fileData) as any
  }
}

export default InvoiceApi
