import { formatCurrency } from '~/utils/common'
import { TradeType } from '~/models/trade'
import { TEXT_CLASS } from './common'

export function ConvertTradeAmount(props: { type: TradeType; money: number }) {
  const isOut = props.type === 'manual_withdraw'
  return (
    <span className={ isOut ? TEXT_CLASS.success : TEXT_CLASS.warning }>
      { isOut ? '-' : '+' }
      { formatCurrency(props.money) }
    </span>
  )
}
