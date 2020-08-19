import { DiscountType } from '~/models/order'

export const DISCOUNT_TYPES = {
  normal: '正常折扣',
  mininum: '区间折扣',
  rebate: '产品折扣',
}

export function ConvertDiscountType(props: { type: DiscountType }) {
  return DISCOUNT_TYPES[props.type] || props.type
}
