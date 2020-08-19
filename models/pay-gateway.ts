export interface PayGateway {
  id: string
  name: string
  type: PayGatewayType
}

export type PayGatewayType = 'alipay' | 'wechatpay'
