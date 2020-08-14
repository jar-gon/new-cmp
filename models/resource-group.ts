import { CloudProvider } from './common'
import { CreateSimpleObject, SimpleObject } from './common'

export interface CreateResourceGroupData extends CreateSimpleObject {
  endpoint_id: string
}

export interface ResourceGroup extends SimpleObject {
  endpoint_name: string
  cloud: CloudProvider
  projects: SimpleObject[]
  members: SimpleObject[]
  created_at: string
}
