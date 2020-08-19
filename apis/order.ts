/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Order } from '~/models/order'

@CommonApiClass
class OrderApi extends Api {
  listOrder(params?: PageQuery): Observable<PageResult<Order>> {
    return this.axios.get('/orders', { params }) as any
  }
}

export default OrderApi
