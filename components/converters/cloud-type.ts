import { CloudProvider } from '~/models/common'
import { AliEndpointType, AWSEndpointType } from '~/models/endpoint'
import { getCloudVendor } from '~/utils/cloud'

export function ConvertCloudType(props: { cloud: CloudProvider; type: AliEndpointType | AWSEndpointType }) {
  return getCloudVendor(props.cloud).type[props.type - 1] || props.type
}
