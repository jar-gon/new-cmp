import { AWSEndpointType } from '~/models/endpoint'

export const AWS_ENDPOINT_TYPE = [ '中国账号', '全球账号' ]

export function ConvertAWSEndpointType(props: { type: AWSEndpointType }) {
  return AWS_ENDPOINT_TYPE[props.type - 1] || props.type
}
