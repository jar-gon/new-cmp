import Icon from 'antd/es/icon'
import { differenceInDays } from 'date-fns'

import { TEXT_CLASS } from './common'

export function ConvertDateDiff(props: { date: string | number | Date }) {
  const days = differenceInDays(props.date instanceof Date ? props.date : new Date(props.date), new Date)
  return (
    <span className={ days <= 7 ? TEXT_CLASS.error : '' }>
      { days <= 7 && <Icon className="margin-right_6" type="exclamation-circle" /> }
      { days >= 0 ? `${ days }天` : '已过期' }
    </span>
  )
}
