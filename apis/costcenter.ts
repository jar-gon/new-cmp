/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { CreateSimpleObject } from '~/models/common'
import { Costcenter } from '~/models/costcenter'

@CommonApiClass
class CostcenterApi extends Api {
  createCostcenter(costcenter: CreateSimpleObject): Observable<string> {
    return this.axios.post('/project', costcenter) as any
  }

  deleteCostcenter(id: string): Observable<void> {
    return this.axios.delete(`/project/${ id }`) as any
  }

  listCostcenter(params?: PageQuery): Observable<PageResult<Costcenter>> {
    return this.axios.get('/project', { params }) as any
  }

  relateResourceGroup(id: string, resourceGroupIds: string[]): Observable<void> {
    return this.axios.post(`/project/${ id }`, { projectIds: resourceGroupIds }) as any
  }
}

export default CostcenterApi
