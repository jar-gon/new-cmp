/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'
import { Dictionary } from '@billypon/ts-types'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { Bank } from '~/models/bank'
import { Balance, RechargeInfo } from '~/models/finance'
import { PayGateway } from '~/models/pay-gateway'

@CommonApiClass
class FinanceApi extends Api {
  balance(): Observable<Balance> {
    return this.axios.get('/balance') as any
  }

  balanceThreshold(quota: string): Observable<void> {
    return this.axios.post('/alarm', { quota }) as any
  }

  getBank(params?: Dictionary): Observable<Bank> {
    return this.axios.get('/bank', { params }) as any
  }

  listGateway(): Observable<PayGateway[]> {
    return this.axios.get('/gateway') as any
  }

  recharge(amount: number, gatewayId: string): Observable<RechargeInfo> {
    return this.axios.post('/recharge', { gateway_id: gatewayId, amount }) as any
  }
}

export default FinanceApi
