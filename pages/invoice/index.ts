import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate } from '~/utils/common'
import { createInvoice, updateInvoice } from '~/modals/pages/index'
import { deleteInvoice } from '~/modals/index'

import InvoiceApi from '~/apis/invoice'
import { Invoice } from '~/models/invoice'

import { ConvertAuditStatus } from '~/components/converters/audit-status'
import { ConvertInvoiceType } from '~/components/converters/invoice-type'

import Document from '~/components/document'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class InvoiceList extends ListComponent<ConnectedProps, ListState<Invoice>> {
  invoiceApi: InvoiceApi

  componentDoInit() {
    this.invoiceApi = new InvoiceApi()
  }

  onLoadItems() {
    return this.invoiceApi.listInvoice({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  @autobind()
  createInvoice(): void {
    createInvoice().afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  @autobind()
  deleteInvoice(invoice: Invoice): void {
    deleteInvoice(invoice).afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  update(invoice: Invoice): void {
    updateInvoice(invoice).afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  render() {
    return template.call(this, { ...this, Document, ShortName, formatCurrency, formatDate, ConvertAuditStatus, ConvertInvoiceType })
  }
}

export default InvoiceList
