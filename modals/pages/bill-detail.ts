import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import ExportJsonExcel from 'js-export-excel'
import format from 'date-fns/format'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { parsePageData } from '~/utils/api'
import { formatCurrency, formatDate } from '~/utils/common'
import { openInvoice } from '~/modals/index'

import BillApi from '~/apis/bill'
import { Bill } from '~/models/bill'

import { DISCOUNT_TYPES } from '~/components/converters/discount-type'

import OrderList from '~/components/partials/order-list'

import template from './bill-detail.pug'

interface BillDetailProps {
  bill: Bill
}

interface BillDetailState {
  bill: Bill
}

@connect(mapState)
export class BillDetail extends ModalComponent<ConnectedProps & BillDetailProps, BillDetailState> {
  billApi: BillApi

  componentDidMount() {
    this.billApi = new BillApi()
    this.getBill()
  }

  getBill(): void {
    const { bill: query } = this.props
    this.billApi.getBill(query.id, query.current_month).subscribe(bill => this.setState({ bill }))
  }

  @autobind()
  exportBillOrder(): void {
    const { bill: query } = this.props
    this.billApi.listBillOrder(query.id, { pagesize: -1, current_month: query.current_month }).pipe(parsePageData).subscribe(orders => {
      const dataTable = []
      for (const order of orders) {
        const obj = {
          '账期': order.billing_cycle,
          '产品名称': order.product_detail,
          '原价': order.pretax_gross_amount,
          '交易金额': order.amount,
          '折扣': order.discount,
          '折扣类型': DISCOUNT_TYPES[order.discount_type],
        }
        dataTable.push(obj)
      }
      const option = {
        fileName: `账单${ format(new Date, 'yyyyMMdd-HHmmss') }`,
        datas: [
          {
            sheetData: dataTable,
            sheetName: query.name,
            sheetHeader: [ '账期', '产品名称', '原价', '交易金额', '折扣', '折扣类型' ],
            columnWidths: [ 6, 12, 6, 6, 5, 6 ]
          }
        ]
      }
      const toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    })
  }

  @autobind()
  openInvoice(): void {
    openInvoice(this.state.bill).afterClose.subscribe(() => {
      this.getBill()
      this.modal.cancelUpdate = true
    })
  }

  render() {
    return template.call(this, { ...this, formatCurrency, formatDate, OrderList })
  }
}

export default BillDetail
