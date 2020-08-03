/* eslint-disable @typescript-eslint/no-empty-function */

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { TableComponent, ListState } from '@billyunq/react-utils/table'
import { FormStates } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'

import { extendParams, extendDateRangeParam } from '~/utils/common'

import { PageResult } from '~/models/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ListComponent<P = { }, S extends ListState = ListState, T = any> extends TableComponent<P, S, T> {
  states: FormStates
  params: Dictionary

  constructor(props) {
    super(props)
    this.componentDoCheck()
    this.onFilter = this.onFilter.bind(this)
  }

  componentDidMount() {
    this.componentDoInit()
    this.states = this.getFilterFormStates()
    if (this.states) {
      this.triggerUpdate()
    }
    this.loadItems()
  }

  protected componentDoCheck(): void {
  }

  protected componentDoInit(): void {
  }

  protected syncPaging = (observable: Observable<PageResult<T>>): Observable<T[]> => {
    return observable.pipe(map((x) => {
      this.totalCount = x.TotalCount
      return x.pageData
    }))
  }

  protected getFilterFormStates(): FormStates {
    return null
  }

  protected onFilter(values: Dictionary): void {
    this.pageNumber = 1
    this.params = { }
    extendParams(this.params, values)
    extendDateRangeParam(this.params, values.datetime)
    this.loadItems()
  }
}
