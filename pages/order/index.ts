import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { FormStates } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { datetime } from '~/utils/form'
import { extendParams, extendDateRangeParam } from '~/utils/common'

import OrderListComponet, { OrderListRef } from '~/components/partials/order-list'

import Document from '~/components/document'
import FilterForm from '~/components/filter-form'
import template from './index.pug'

@connect(mapState)
class OrderList extends Component<ConnectedProps> {
  states: FormStates
  params: Dictionary
  orderList: OrderListRef

  componentDidMount() {
    this.states = this.getFilterFormStates()
    this.orderList = new OrderListRef()
    this.triggerUpdate()
  }

  getFilterFormStates() {
    return {
      order_id: {
        label: '订单号',
      },
      datetime: datetime(),
    }
  }

  @autobind()
  protected onFilter(values: Dictionary): void {
    this.params = { }
    extendParams(this.params, values)
    extendDateRangeParam(this.params, values.datetime)
    this.triggerUpdate().subscribe(() => {
      this.orderList.resetPageNumber()
      this.orderList.loadItems()
    })
  }

  render() {
    return template.call(this, { ...this, Document, FilterForm, OrderList: OrderListComponet })
  }
}

export default OrderList
