/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { PageResult, PageQuery } from '~/models/api'
import { Subscriber } from '~/models/subscriber'

@CommonApiClass
class SubscriberApi extends Api {
  listSubscriber(params?: PageQuery): Observable<PageResult<Subscriber>> {
    return this.axios.get('/member', { params }) as any
  }
}

export default SubscriberApi
