import { connect } from 'react-redux/es'
import { SelectAddition } from '@billyunq/react-utils/simple-form'
import { ListState } from '@billyunq/react-utils/table'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { datetime } from '~/utils/form'
import { formatCurrency, formatDate } from '~/utils/common'

import TradeApi from '~/apis/trade'
import { Trade } from '~/models/trade'

import { ConvertTradeAmount } from '~/components/converters/trade-amount'
import { TRADE_TYPE, ConvertTradeType } from '~/components/converters/trade-type'

import Document from '~/components/document'
import FilterForm from '~/components/filter-form'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class TradeList extends ListComponent<ConnectedProps, ListState<Trade>> {
  tradeApi: TradeApi

  componentDoInit() {
    this.tradeApi = new TradeApi()
  }

  onLoadItems() {
    return this.tradeApi.listTrade({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...this.params,
    }).pipe(this.syncPaging)
  }

  getFilterFormStates() {
    return {
      order_type: {
        label: '类别',
        type: 'select',
        addition: {
          allowClear: true,
          data: [
            ...Object.keys(TRADE_TYPE).map(x => ({ label: TRADE_TYPE[x], value: x })),
          ]
        } as SelectAddition,
      },
      datetime: datetime(),
    }
  }

  render() {
    return template.call(this, { ...this, Document, FilterForm, ShortName, formatCurrency, formatDate, ConvertTradeAmount, ConvertTradeType })
  }
}

export default TradeList
