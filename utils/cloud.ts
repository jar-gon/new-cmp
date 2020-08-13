/* eslint-disable global-require */

import { CloudProvider } from '~/models/common'

export interface CloudVendor {
  provider: CloudProvider
  name: string
  icon: string
  iconGrey: string
  type?: string[]
  disabled?: boolean
}

export const CLOUD_VENDORS: CloudVendor[] = [
  {
    provider: 'aliyun',
    name: '阿里云',
    icon: require('~/assets/cloud/aliyun.png'),
    iconGrey: require('~/assets/cloud/aliyun-grey.png'),
    type: [ '自有账号', 'MSP代理账号', '折扣账号' ],
  },
  {
    provider: 'aws',
    name: 'AWS',
    icon: require('~/assets/cloud/aws.png'),
    iconGrey: require('~/assets/cloud/aws-grey.png'),
    type: [ '中国账号', '全球账号' ],
    disabled: true,
  },
  // {
  //   provider: 'tencent',
  //   name: '腾讯云',
  //   icon: require('~/assets/cloud/tencent.png'),
  //   iconGrey: require('~/assets/cloud/tencent-grey.png'),
  //   disabled: true,
  // },
  // {
  //   provider: 'huawei',
  //   name: '华为云',
  //   icon: require('~/assets/cloud/huawei.png'),
  //   iconGrey: require('~/assets/cloud/huawei-grey.png'),
  //   disabled: true,
  // },
  // {
  //   provider: 'ucloud',
  //   name: 'UCloud',
  //   icon: require('~/assets/cloud/ucloud.png'),
  //   iconGrey: require('~/assets/cloud/ucloud-grey.png'),
  //   disabled: true,
  // },
  // {
  //   provider: 'azure',
  //   name: 'Azure',
  //   icon: require('~/assets/cloud/azure.png'),
  //   iconGrey: require('~/assets/cloud/azure-grey.png'),
  //   disabled: true,
  // },
]

export function getCloudVendor(cloud: CloudProvider): CloudVendor {
  return CLOUD_VENDORS.filter(x => x.provider === cloud)[0]
}
