import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { datetime } from '~/utils/form'
import { formatCurrency, formatDate } from '~/utils/common'

import OrderApi from '~/apis/order'
import { Order } from '~/models/order'

import { ConvertDiscountType } from '~/components/converters/discount-type'
import { ConvertSubscriptionType } from '~/components/converters/subscription-type'

import Document from '~/components/document'
import FilterForm from '~/components/filter-form'
import template from './index.pug'

@connect(mapState)
class OrderList extends ListComponent<ConnectedProps, ListState<Order>> {
  orderApi: OrderApi

  componentDoInit() {
    this.orderApi = new OrderApi()
  }

  onLoadItems() {
    return this.orderApi.listOrder({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...this.params,
    }).pipe(this.syncPaging)
  }

  getFilterFormStates() {
    return {
      order_id: {
        label: '订单号',
      },
      datetime: datetime(),
    }
  }

  render() {
    return template.call(this, { ...this, Document, FilterForm, formatCurrency, formatDate, ConvertDiscountType, ConvertSubscriptionType })
  }
}

export default OrderList
