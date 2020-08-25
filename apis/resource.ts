/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { Region, ResourceCount } from '~/models/resource'

@CommonApiClass
class ResourceApi extends Api {
  getResourceCount(endpointId: string): Observable<ResourceCount> {
    return this.axios.get(`/collect/resource_count/${ endpointId }`) as any
  }

  listRegion(endpointId: string): Observable<Region[]> {
    return this.axios.get(`/resources/${ endpointId }`) as any
  }
}

export default ResourceApi
