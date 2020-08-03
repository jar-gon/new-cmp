import { CloudProvider } from '~/models/common'

export const CLOUD_PROVIDERS = {
  aliyun: '阿里云',
  aws: 'AWS',
}

export function ConvertCloudProvider(props: { type: CloudProvider }) {
  return CLOUD_PROVIDERS[props.type] || props.type
}
