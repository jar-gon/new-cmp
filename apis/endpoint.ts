/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { Console, CreateEndpointData, Endpoint } from '~/models/endpoint'

@CommonApiClass
class EndpointApi extends Api {
  createEndpoint(data: CreateEndpointData): Observable<Endpoint> {
    return this.axios.post('/endpoint', data) as any
  }

  deleteEndpoint(id: string): Observable<void> {
    return this.axios.delete(`/endpoint/${ id }`) as any
  }

  getConsole(id: string): Observable<Console> {
    return this.axios.get(`/console/${ id }`) as any
  }

  getEndpoint(id: string): Observable<Endpoint> {
    return this.axios.get(`/endpoint/${ id }`) as any
  }

  listEndpoint(params?: PageQuery): Observable<PageResult<Endpoint>> {
    return this.axios.get('/endpoint', { params }) as any
  }

  updateEndpoint(id: string, endpoint: Endpoint): Observable<void> {
    return this.axios.patch(`/endpoint/${ id }`, endpoint) as any
  }
}

export default EndpointApi
