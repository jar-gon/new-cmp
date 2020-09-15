/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { CostConsume, Endpoint, EndpointConsume, ProductConsume, Summary } from '~/models/index'

@CommonApiClass
class IndexApi extends Api {
  getCostConsume(): Observable<CostConsume[]> {
    return this.axios.get('/project-balance') as any
  }

  getEndpointConsume(mode?: string): Observable<EndpointConsume[]> {
    const params = { mode }
    return this.axios.get('/trend', { params }) as any
  }

  getProductConsume(): Observable<ProductConsume[]> {
    return this.axios.get('/service-balance') as any
  }

  getSummary(): Observable<Summary> {
    return this.axios.get('/compares') as any
  }

  listEndpoint(): Observable<Endpoint[]> {
    return this.axios.get('/clouds') as any
  }
}

export default IndexApi
