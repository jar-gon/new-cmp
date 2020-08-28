import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate } from '~/utils/common'
import { billDetail } from '~/modals/pages/index'
import { openInvoice } from '~/modals/index'

import BillApi from '~/apis/bill'
import { Bill } from '~/models/bill'

import { ConvertBillStatus } from '~/components/converters/bill-status'
import { ConvertInvoiceType } from '~/components/converters/invoice-type'

import Document from '~/components/document'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class BillList extends ListComponent<ConnectedProps, ListState<Bill>> {
  billApi: BillApi

  componentDoInit() {
    this.billApi = new BillApi()
  }

  onLoadItems() {
    return this.billApi.listBill({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  @autobind()
  detail(bill: Bill): void {
    billDetail(bill).afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  @autobind()
  openInvoice(bill: Bill): void {
    openInvoice(bill).afterClose.subscribe(() => this.loadItems())
  }

  render() {
    return template.call(this, { ...this, Document, ShortName, formatCurrency, formatDate, ConvertBillStatus, ConvertInvoiceType })
  }
}

export default BillList
