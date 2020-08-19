export interface Trade {
  order_type: TradeType
  amount: number
  balance: number
  trade_stat: TradeStatus
  create_time: string
  comment: string
}

export type TradeStatus = 'recharging' | 'success' | 'recharge_failed'

export type TradeType = 'recharge' | 'manual_recharge' | 'manual_withdraw'
