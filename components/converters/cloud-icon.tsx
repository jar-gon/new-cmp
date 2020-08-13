import { CloudProvider } from '~/models/common'
import { getCloudVendor } from '~/utils/cloud'

export function ConvertCloudIcon(props: { cloud: CloudProvider; className: string }) {
  return <img className={ props.className ? `cloud--icon ${ props.className }` : 'cloud--icon' } src={ getCloudVendor(props.cloud).icon } alt={ props.cloud } />
}
