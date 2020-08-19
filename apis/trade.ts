/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Trade } from '~/models/trade'

@CommonApiClass
class TradeApi extends Api {
  getTrade(id: string): Observable<Trade> {
    return this.axios.get(`/trade/${ id }`) as any
  }

  listTrade(params?: PageQuery): Observable<PageResult<Trade>> {
    return this.axios.get('/trades', { params }) as any
  }
}

export default TradeApi
