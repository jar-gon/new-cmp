import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import FINANCE_MENUS from '~/modules/finance'

import BillList from '../bill'
import InvoiceList from '../invoice'
import OrderList from '../order'
import Recharge from '../recharge'
import TradeList from '../trade'

import SiteLayout from '~/components/layout'
import template from './index.pug'

interface FinanceStates {
  index: number
}

@connect(mapState)
class FinanceIndex extends Component<ConnectedProps, FinanceStates> {
  getInitialState() {
    return {
      index: 0
    }
  }

  @autobind()
  menuChange(e): void {
    this.setState({ index: e.target.value })
  }

  render() {
    return template.call(this, { ...this, SiteLayout, FINANCE_MENUS, BillList, InvoiceList, OrderList, Recharge, TradeList })
  }
}

export default FinanceIndex
