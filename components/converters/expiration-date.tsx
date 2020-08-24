import { PayType } from '~/models/common'
import { ConvertDateDiff } from './date-diff'

export function ConvertExpirationDate(props: { date: string | number | Date; type: PayType }) {
  return props.type && props.type.toLowerCase() === 'postpaid' ? '按量付费' : <ConvertDateDiff date={ props.date } />
}
