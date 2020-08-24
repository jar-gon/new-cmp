/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { Instance, InstanceSummary, InstanceSummaryData } from '~/models/instance'

@CommonApiClass
class InstanceApi extends Api {
  changePower(cloud: string, endpointId: string, regionId: string, id: string, action: string): Observable<void> {
    const params = { cloud, endpoint_id: endpointId, region_id: regionId }
    return this.axios.get(`/instance/${ id }/${ action }`, { params }) as any
  }

  getSummary(params: InstanceSummaryData): Observable<InstanceSummary> {
    return this.axios.get('/resource_instanceinfo', { params }) as any
  }

  getVNC(id: string, endpointId: string, regionId: string): Observable<string> {
    const params = { endpoint_id: endpointId, region_id: regionId }
    return this.axios.get(`/instance/${ id }/vnc`, { params }) as any
  }

  listInstance(params?: PageQuery): Observable<PageResult<Instance>> {
    return this.axios.get('/resources_instances', { params }) as any
  }

  resetPassword(id: string, endpointId: string, regionId: string, password: string): Observable<void> {
    const params = { endpoint_id: endpointId, region_id: regionId, password }
    return this.axios.patch(`/instance/${ id }/reset/password`, { params }) as any
  }

  updateName(id: string, endpointId: string, regionId: string, hostname: string): Observable<void> {
    const params = { endpoint_id: endpointId, region_id: regionId, hostname }
    return this.axios.patch(`/instance/${ id }/reset/hostname`, { params }) as any
  }
}

export default InstanceApi
