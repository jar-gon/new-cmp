import { TradeType } from '~/models/trade'

export const TRADE_TYPE = {
  payment: '支出',
  recharge: '充值',
  manual_recharge: '人工充值',
  manual_withdraw: '扣款',
}

export function ConvertTradeType(props: { type: TradeType }) {
  return TRADE_TYPE[props.type] || props.type
}
