import { SubscriptionType } from '~/models/order'

export const SUBSCRIPTION_TYPES = {
  Subscription: '包年包月',
  PayAsYouGo: '按量付费',
}

export function ConvertSubscriptionType(props: { type: SubscriptionType }) {
  return SUBSCRIPTION_TYPES[props.type] || props.type
}
