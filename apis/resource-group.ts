/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { CreateResourceGroupData, ResourceGroup } from '~/models/resource-group'

@CommonApiClass
class ResourceGroupApi extends Api {
  createResourceGroup(resourceGroup: CreateResourceGroupData): Observable<void> {
    return this.axios.post('/resourcegroup', resourceGroup) as any
  }

  listResourceGroup(params?: PageQuery): Observable<PageResult<ResourceGroup>> {
    return this.axios.get('/resourcegroup', { params }) as any
  }

  relateMember(id: string, memberIds: string[]): Observable<void> {
    return this.axios.post(`/resourcegroup/${ id }`, { memberIds }) as any
  }
}

export default ResourceGroupApi
