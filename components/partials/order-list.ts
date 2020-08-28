import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { Dictionary } from '@billypon/ts-types'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate } from '~/utils/common'

import BillApi from '~/apis/bill'
import OrderApi from '~/apis/order'
import { Order } from '~/models/order'

import { ConvertDiscountType } from '~/components/converters/discount-type'
import { ConvertSubscriptionType } from '~/components/converters/subscription-type'

import template from './order-list.pug'

export class OrderListRef {
  /* eslint-disable @typescript-eslint/no-empty-function */

  loadItems(): void {
  }

  resetPageNumber(): void {
  }

  /* eslint-enable @typescript-eslint/no-empty-function */
}

interface OrderListProps {
  _ref: OrderListRef
  params: Dictionary
  isBillDetail: boolean
}

@connect(mapState)
class OrderList extends ListComponent<ConnectedProps & OrderListProps, ListState<Order>> {
  billApi: BillApi
  orderApi: OrderApi

  componentDoInit() {
    const { _ref } = this.props
    this.billApi = new BillApi()
    this.orderApi = new OrderApi()
    if (_ref) {
      Object.assign(_ref, {
        loadItems: this.loadItems.bind(this),
        resetPageNumber: () => this.pageNumber = 1
      })
    }
  }

  onLoadItems() {
    const { params, isBillDetail } = this.props
    if (isBillDetail) {
      const billId = params.bill_id
      delete params.bill_id
      return this.billApi.listBillOrder(billId, {
        pagenumber: this.pageNumber,
        pagesize: this.pageSize,
        ...params,
      }).pipe(this.syncPaging)
    } else {
      return this.orderApi.listOrder({
        pagenumber: this.pageNumber,
        pagesize: this.pageSize,
        ...params,
      }).pipe(this.syncPaging)
    }
  }

  render() {
    return template.call(this, { ...this, formatCurrency, formatDate, ConvertDiscountType, ConvertSubscriptionType })
  }
}

export default OrderList
