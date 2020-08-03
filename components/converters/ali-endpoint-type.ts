import { AliEndpointType } from '~/models/endpoint'

export const ALI_ENDPOINT_TYPE = [ '自有账号', 'MSP代理账号', '折扣账号' ]

export function ConvertAliEndpointType(props: { type: AliEndpointType }) {
  return ALI_ENDPOINT_TYPE[props.type - 1] || props.type
}
