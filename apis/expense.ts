/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { Expense, ExpenseParams } from '~/models/expense'

@CommonApiClass
class ExpenseApi extends Api {
  expenseList(params: ExpenseParams): Observable<Expense[]> {
    return this.axios.get('/trend', { params }) as any
  }
}

export default ExpenseApi
