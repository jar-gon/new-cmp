export interface Order {
  id: string
  create_time: string
  order_id: string
  discount: number
  amount: number
  pretax_gross_amount: number
  product_code: string
  product_type: string
  subscription_type: SubscriptionType
  discount_type: DiscountType
}

export type SubscriptionType = 'Subscription' | 'PayAsYouGo'
export type DiscountType = 'normal' | 'mininum' | 'rebate'
