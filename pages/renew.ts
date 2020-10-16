import router, { withRouter } from 'next/router'
import { connect } from 'react-redux/es'
import { RadioChangeEvent } from 'antd/es/radio'
import { Subscription, interval } from 'rxjs'
import { exhaustMap, retry } from 'rxjs/operators'
import { Component } from '@billyunq/react-utils/react'
import Modal from '@billyunq/react-utils/modal'
import { dev } from '@billyunq/react-utils/common'
import { autobind } from '@billypon/react-decorator'
import Template from '@billypon/react-template'
import QRCode from 'qrcode.react'

import { mapState, ConnectedProps } from '~/utils/redux'
import Notification from '~/utils/notification'

import FinanceApi from '~/apis/finance'
import TradeApi from '~/apis/trade'
import { ApiResult } from '~/models/api'
import { Duration } from '~/models/subscriber'
import { PayGateway } from '~/models/pay-gateway'

import { ConvertPayGetwary } from '~/components/converters/pay-getwary'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import Font10 from '~/components/font-10'
import template from './renew.pug'

const DURATION = [
  {
    id: '1',
    name: '一个月',
    month: 1,
    price: 888
  },
  {
    id: '2',
    name: '6个月',
    month: 6,
    price: 4888
  },
  {
    id: '3',
    name: '一年',
    month: 12,
    price: 8888
  },
  {
    id: '4',
    name: '两年',
    month: 24,
    price: 12888
  }
] as Duration[]

interface RenewState {
  durations: Duration[]
  expire: string
  gateways: PayGateway[]
  selectedDuration: Duration
  selectedGateway: PayGateway
  payUrl: string
  refreshTime: number
}

@withRouter
@connect(mapState([ 'account' ]))
class Renew extends Component<ConnectedProps, RenewState> {
  financeApi: FinanceApi
  tradeApi: TradeApi

  modal: Modal
  refreshInterval: NodeJS.Timeout
  orderSubscription: Subscription
  qrcodeModal: Template

  componentDidMount() {
    this.financeApi = new FinanceApi()
    this.tradeApi = new TradeApi()
    this.financeApi.listGateway().subscribe(gateways => {
      this.setState({
        durations: DURATION,
        expire: '2002-10-15 23:59:59',
        gateways,
        selectedDuration: DURATION[0],
        selectedGateway: gateways[0],
      })
    })
  }

  componentWillUnmount() {
    if (this.modal) {
      this.modal.close()
    }
  }

  clearTradeSubscription() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe()
      this.orderSubscription = null
    }
  }

  getDue(length: number): string {
    const date = new Date()
    let month = date.getMonth() + 1 + length
    const year = date.getFullYear() + Math.floor(month / 12)
    month %= 12
    const date2 = new Date(year, month, 0)
    let day = date.getDate()
    const day2 = date2.getDate()
    day = day > day2 ? day2 : day
    return `${ year }-${ month }-${ day } 23:59:59`
  }

  refreshPayUrl(): void {
    this.setState({ payUrl: null })
    this.clearTradeSubscription()
    this.financeApi.recharge(this.state.selectedDuration.price, this.state.selectedGateway.id).subscribe(({ url, trade_id }) => {
      let refreshTime = 180
      this.setState({ payUrl: url, refreshTime })
      this.refreshInterval = setInterval(() => {
        refreshTime--
        this.setState({ refreshTime })
        if (refreshTime <= 0) {
          clearInterval(this.refreshInterval)
          this.refreshPayUrl()
        }
      }, 1000)
      const delay = !dev ? 1000 : 10000
      this.orderSubscription = interval(delay).pipe(
        exhaustMap(() => this.tradeApi.getTrade(trade_id)),
        retry(),
      ).subscribe(trade => {
        switch (trade.trade_stat) {
          case 'success':
            router.push('/subscriber')
            break
          case 'recharge_failed':
            Notification.error('订阅失败')
            this.modal.close()
            break
        }
      })
    }, (err: ApiResult) => {
      if (err && err.retCode) {
        Notification.error('订阅失败', err.retMsg)
        this.modal.close()
      }
    })
  }

  @autobind()
  doRenew(): void {
    this.refreshPayUrl()
    this.modal = new Modal({
      content: this.qrcodeModal,
      width: 360,
      wrapClassName: 'modal-qrcode',
      okText: '继续订阅',
      onOk: () => {
        this.modal.close()
      },
      cancelButtonProps: {
        hidden: true,
      },
    })
    this.modal.open()
    this.modal.afterClose.subscribe(() => {
      this.clearTradeSubscription()
      clearInterval(this.refreshInterval)
      this.modal = null
    })
  }

  @autobind()
  selectDuration({ target: { value } }: RadioChangeEvent): void {
    const expire = this.getDue(value.month)
    this.setState({
      expire,
      selectedDuration: value,
    })
  }

  @autobind()
  selectGateway({ target: { value } }: RadioChangeEvent): void {
    this.setState({ selectedGateway: value })
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, QRCode, Font10, ConvertPayGetwary })
  }
}

export default Renew
