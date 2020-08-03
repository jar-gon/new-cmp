/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable, interval } from 'rxjs'
import { map, tap, exhaustMap } from 'rxjs/operators'
import { Dictionary } from '@billypon/ts-types'
import { ObservablePipe } from '@billypon/rxjs-types'

import Notification from './notification'

export interface TaskInfo<T = any> {
  value: T
  action: string
  messageId: string
}

export interface TaskResult<T = any> {
  value: T
  success: boolean
}

export type WaitCallback<T = any> = Observable<TaskResult> | ((value: T) => Observable<TaskResult>)

export function mapResult<T = any>(callback: (value: T) => boolean): ObservablePipe<TaskResult, T> {
  return (observable: Observable<T>) => {
    return observable.pipe(map(value => {
      const success = callback(value)
      return { value, success }
    }))
  }
}

export function mapStatus(name = 'status'): ObservablePipe<TaskResult> {
  return mapResult<Dictionary>(value => !(value && value[name] === 'error'))
}

export function appendTask(action: string): ObservablePipe {
  return (observable: Observable<any>) => {
    const messageId = Notification.info(action, '')
    return observable.pipe(tap(
      () => {
        Notification.success(action, '操作成功')
        Notification.close(messageId)
      },
      (err) => {
        Notification.error(action, `操作失败：${ err.retMsg }`)
        Notification.close(messageId)
      },
    ))
  }
}

export function appendAsyncTask(action: string): ObservablePipe<TaskInfo> {
  return (observable: Observable<any>) => {
    return new Observable<TaskInfo>(observer => {
      const messageId = Notification.info(action, '')
      observable.subscribe(
        value => observer.next({ value, action, messageId }),
        err => {
          Notification.error(action, `操作失败：${ err.retMsg }`)
          Notification.close(messageId)
          observer.error(err)
        },
        () => observer.complete(),
      )
    })
  }
}

export function waitForResult<T = any>(wait: WaitCallback<T>, period = 10000): ObservablePipe<T, TaskInfo> {
  return (observable: Observable<TaskInfo>) => {
    return new Observable<T>(observer => {
      observable.subscribe(({ value, action, messageId }) => {
        const subscription = interval(period).pipe(exhaustMap(() => wait instanceof Observable ? wait : wait(value))).subscribe(
          result => {
            switch (result.success) {
              case true:
                Notification.success(action, '操作成功')
                break
              case false:
                Notification.error(action, '操作失败')
                break
              default:
                return
            }
            Notification.close(messageId)
            observer.next(result.value)
            observer.complete()
            subscription.unsubscribe()
          },
          err => {
            Notification.error(action, `操作失败：${ err.retMsg }`)
            Notification.close(messageId)
            observer.error(err)
          },
        )
      })
    })
  }
}
