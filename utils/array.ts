/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dictionary } from '@billypon/ts-types'

export function zipObject(keys: string[], values: any[]): Dictionary {
  return keys.reduce((result: Dictionary, key: string, index: number) => {
    result[key] = values[index]
    return result
  }, { })
}

export function arrayToDictionary(array: any[], key = 'id'): Dictionary {
  const dictionary: Dictionary = { }
  array.forEach(x => dictionary[x[key]] = x)
  return dictionary
}

export function removeIndex(array: any[], index: number): any[] {
  return array.filter((_, i) => i !== index)
}
