/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dictionary } from '@billypon/ts-types'

export interface ApiResult<T = any> {
  retCode: string
  retMsg: string
  data: T
}

export interface PageResult<T = any> {
  pageNumber: number
  pageSize: number
  TotalCount: number
  pageData: T[]
}

export interface PageQuery extends Dictionary {
  pagenumber?: number
  pagesize?: number
}
