import { PayType } from '~/models/common'

export function ConvertPayType(props: { type: PayType }) {
  switch (props.type.toLowerCase()) {
    case 'postpaid':
      return '按量付费'
  }
  return '包年包月'
}
