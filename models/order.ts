export interface BaseOrder {
  discount: number
  amount: number
  pretax_gross_amount: number
  discount_type: DiscountType
}

export interface Order extends BaseOrder {
  id: string
  create_time: string
  order_id: string
  product_code: string
  product_type: string
  subscription_type: SubscriptionType
}

export type DiscountType = 'normal' | 'mininum' | 'rebate'

export type SubscriptionType = 'Subscription' | 'PayAsYouGo'
