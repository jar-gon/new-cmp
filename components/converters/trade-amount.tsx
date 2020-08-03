import { formatCurrency } from '~/utils/common'
import { TradeType } from '~/models/trade'
import { TEXT_CLASS } from './common'

export function TradeAmountStatus(props: { type: TradeType; money: number }) {
  const isOut = [ 'payment', 'manual_withdraw' ].includes(props.type)
  return (
    <span className={ isOut ? TEXT_CLASS.success : TEXT_CLASS.warning }>
      { isOut ? '-' : '+' }
      { formatCurrency(props.money) }
    </span>
  )
}
