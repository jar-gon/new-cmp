import { CloudProvider } from '~/models/common'
import { getCloudVendor } from '~/utils/cloud'

export function ConvertCloudImg(props: { cloud: CloudProvider }) {
  return <img src={ getCloudVendor(props.cloud).img } alt={ props.cloud } />
}
