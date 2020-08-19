import { connect } from 'react-redux/es'
import { RadioChangeEvent } from 'antd/es/radio'
import { Subscription, forkJoin, interval } from 'rxjs'
import { exhaustMap, retry } from 'rxjs/operators'
import { Component } from '@billyunq/react-utils/react'
import Modal from '@billyunq/react-utils/modal'
import { dev } from '@billyunq/react-utils/common'
import { autobind } from '@billypon/react-decorator'
import Template from '@billypon/react-template'
import QRCode from 'qrcode.react'

import { mapState, ConnectedProps } from '~/utils/redux'
import { bankFormat, formatCurrency, getNumberParser } from '~/utils/common'
import Notification from '~/utils/notification'
import { balanceThreshold } from '~/modals/index'

import FinanceApi from '~/apis/finance'
import TradeApi from '~/apis/trade'
import { ApiResult } from '~/models/api'
import { Balance } from '~/models/finance'
import { Bank } from '~/models/bank'
import { PayGateway } from '~/models/pay-gateway'

import { ConvertPayGetwary } from '~/components/converters/pay-getwary'

import Document from '~/components/document'
import Font10 from '~/components/font-10'
import template from './index.pug'

interface RechargeState {
  balance: Balance
  banks: Bank
  noBanks: boolean
  gateways: PayGateway[]
  amountType: 'select' | 'input'
  amountValue: number
  selectedAmount: number
  inputedAmount: number
  selectedGateway: PayGateway
  payUrl: string
  refreshTime: number
  loading: boolean
}

@connect(mapState([ 'account' ]))
class Recharge extends Component<ConnectedProps, RechargeState> {
  financeApi: FinanceApi
  tradeApi: TradeApi

  amounts = [ 2000, 5000, 10000, 20000, 50000 ]
  inputNumberMin = this.props.account.username === 'Demo321' ? 1 : 2000

  modal: Modal
  refreshInterval: NodeJS.Timeout
  orderSubscription: Subscription
  qrcodeModal: Template

  componentDidMount() {
    this.financeApi = new FinanceApi()
    this.tradeApi = new TradeApi()
    this.getBalance()
    forkJoin(
      this.financeApi.getBank(),
      this.financeApi.listGateway(),
    ).subscribe(([ banks, gateways ]) => {
      this.setState({
        noBanks: !Object.keys(banks).length,
        banks,
        gateways,
        selectedGateway: gateways[0],
        amountType: 'select',
        amountValue: this.amounts[0],
        selectedAmount: this.amounts[0],
        inputedAmount: this.amounts[0],
      })
    })
  }

  componentWillUnmount() {
    if (this.modal) {
      this.modal.close()
    }
  }

  getBalance() {
    this.financeApi.balance().subscribe(balance => {
      this.setState({ balance })
    })
  }

  clearTradeSubscription() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe()
      this.orderSubscription = null
    }
  }

  refreshPayUrl(): void {
    this.setState({ payUrl: null })
    this.clearTradeSubscription()
    this.financeApi.recharge(this.state.amountValue, this.state.selectedGateway.id).subscribe(({ url, trade_id }) => {
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
            Notification.success('充值成功')
            this.getBalance()
            this.modal.close()
            break
          case 'recharge_failed':
            Notification.error('充值失败')
            this.modal.close()
            break
        }
      })
    }, (err: ApiResult) => {
      if (err && err.retCode) {
        Notification.error('充值失败', err.retMsg)
        this.modal.close()
      }
    })
  }

  @autobind()
  balanceThreshold(): void {
    balanceThreshold(this.state.balance.quota).afterClose.subscribe(() => this.getBalance())
  }

  @autobind()
  changeAmount(value: number): void {
    this.setState({ amountValue: value, inputedAmount: value })
  }

  @autobind()
  selectAmount({ target: { value } }: RadioChangeEvent): void {
    this.setState({ amountType: 'select', amountValue: value, selectedAmount: value, inputedAmount: value })
  }

  @autobind()
  selectGateway({ target: { value } }: RadioChangeEvent): void {
    this.setState({ selectedGateway: value })
  }

  @autobind()
  setAmountType(): void {
    this.setState({ amountType: 'input', selectedAmount: -1 })
  }

  @autobind()
  doRecharge(): void {
    this.refreshPayUrl()
    this.modal = new Modal({
      content: this.qrcodeModal,
      width: 360,
      wrapClassName: 'modal-qrcode',
      okText: '继续充值',
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
      this.setState({ loading: false })
    })
  }

  render() {
    return template.call(this, { ...this, Document, QRCode, Font10, bankFormat, formatCurrency, getNumberParser, ConvertPayGetwary })
  }
}

export default Recharge
