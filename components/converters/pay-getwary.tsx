/* eslint-disable global-require */

import { PayGatewayType } from '~/models/pay-gateway'

const GATEWAYS = {
  alipay: require('~/assets/alipay.jpg'),
  wechatpay: require('~/assets/wechat.jpg'),
}

export function ConvertPayGetwary(props: { type: PayGatewayType }) {
  return <img src={ GATEWAYS[props.type] } alt={ props.type } />
}
