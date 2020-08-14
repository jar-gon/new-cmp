/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { Relation, RelationSummary } from '~/models/relation'

@CommonApiClass
class RelationApi extends Api {
  getRelationSummary(): Observable<RelationSummary> {
    return this.axios.get('/project_summary') as any
  }

  listRelation(params?: PageQuery): Observable<PageResult<Relation>> {
    return this.axios.get('/relation', { params }) as any
  }
}

export default RelationApi
