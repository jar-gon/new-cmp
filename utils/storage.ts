import { browser } from '@billyunq/react-utils/common'
import { Dictionary } from '@billypon/ts-types'

const localStorage = browser ? window.localStorage : { } as Dictionary

function getValue(key): string {
  return localStorage[key]
}

function setValue(key, value): void {
  switch (value) {
    case undefined:
    case null:
      delete localStorage[key]
      break
    default:
      localStorage[key] = value
      break
  }
}

class Storage {
  private _token: string = getValue('token')

  get token(): string {
    return this._token
  }

  set token(value: string) {
    setValue('token', value)
    this._token = value
  }
}

export const storage = new Storage

export function checkLogin(): boolean {
  return localStorage.token
}
