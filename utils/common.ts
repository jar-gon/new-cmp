/* eslint-disable @typescript-eslint/no-explicit-any */

import { UploadFile } from 'antd/es/upload/interface'
import { Observable, Subject, BehaviorSubject, of } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { Moment } from 'moment'
import format from 'date-fns/format'
import Template from '@billypon/react-template'
import { Dictionary } from '@billypon/ts-types'

export interface ExtraProps {
  $key?: string
  $disabled?: boolean
  $checked?: boolean
}

export function getNumberParser(defaultNumber: number = 0): (value: string) => number {
  return (value: string) => {
    return parseInt(value, 10) || defaultNumber
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CNY',
  currencyDisplay: 'code',
})

export function formatDate(date: Date | string): string {
  return format(date instanceof Date ? date : new Date(date), 'yyyy-MM-dd HH:mm:ss')
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace(/CNY\s?/, '')
}

export function strmax(value: string, max: number = 32, suffix: string | false = false): string {
  if (value.length <= max / 2) {
    return value
  }
  let count = 0
  let length = max
  while (count < value.length) {
    length -= value.charCodeAt(count) < 255 ? 1 : 2
    if (length < 0) {
      break
    }
    count++
  }
  let str = value.substr(0, count)
  if (suffix && str.length < value.length) {
    str += suffix
  }
  return str
}

export function timeToISOString(time: Moment, isEndTime?: boolean): string {
  return `${ (!isEndTime ? time.add(-1, 'd') : time).toISOString().substr(0, 11) }${ !isEndTime ? '16:00:00' : '15:59:59' }.000Z`
}

export function extendParams(query: Dictionary, value: Dictionary, skip = 'datetime'): void {
  Object.keys(value)
    .filter(x => x !== skip && ![ undefined, null ].includes(value[x]))
    .forEach(x => query[x] = value[x])
}

export function extendDateRangeParam(query: Dictionary, dates: Moment[], [ startKey, endKey ] = [ 'start', 'end' ], fixTime = false): void {
  const [ startTime, endTime ] = dates || [ ] as Moment[]
  const TZ8 = 8 * 3600 * 1000
  if (startTime && startKey) {
    const startString = new Date((+startTime + TZ8)).toISOString()
    query[startKey] = !fixTime ? `${ startString.substr(0, startString.length - 5) }Z` : `${ startString.substr(0, 11) }00:00:00Z`
  }
  if (endTime && endKey) {
    const endString = new Date((+endTime + TZ8)).toISOString()
    query[endKey] = !fixTime ? `${ endString.substr(0, endString.length - 5) }Z` : `${ endString.substr(0, 11) }23:59:59Z`
  }
}

export function mapUrlToFile(url: string): UploadFile {
  return url && {
    uid: url,
    thumbUrl: url,
    status: 'done',
  } as UploadFile
}

export function combineFunctions(...fns: Function[]) {
  return (value: unknown): void => {
    fns.forEach(fn => fn(value))
  }
}

export function renderTemplate(template: Template) {
  return template ? template.template : ''
}

export class DebounceFilter<T = any> {
  private subject: BehaviorSubject<T>
  loading = false
  result: T
  resultChange = new Subject<T>()

  constructor(filter: (value: any) => Observable<T>, defaultValue?: any) {
    this.subject = new BehaviorSubject<T>(defaultValue)
    this.subject.asObservable().pipe(
      debounceTime(500),
      switchMap(value => new Observable<T>(observer => {
        const observable = filter(value) || of(null)
        return observable.subscribe(result => observer.next(result), () => observer.next(), () => observer.complete())
      }))
    ).subscribe((result: T) => {
      this.loading = false
      this.result = result
      this.resultChange.next(result)
    })
  }

  next(value?: any): void {
    this.loading = true
    this.result = undefined
    this.resultChange.next(undefined)
    this.subject.next(value)
  }
}
