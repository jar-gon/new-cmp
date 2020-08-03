/* eslint-disable @typescript-eslint/no-explicit-any */

import { map } from 'rxjs/operators'
import { FormState, SelectAddition, SelectDataOption } from '@billyunq/react-utils/simple-form'

import Api from '~/apis/common'
import { parseData } from './api'

import { SimpleObject } from '~/models/common'
import { ENABLED_STATUS } from '~/components/converters/enabled-status'
import { NORMAL_STATUS } from '~/components/converters/normal-status'

export interface FormFieldError {
  message: string
  target?: any
}

export function status(data: SelectDataOption[], label = '状态'): FormState {
  return {
    label,
    type: 'select',
    addition: {
      allowClear: true,
      data,
    } as SelectAddition,
  }
}

export function enabledStatus(): FormState {
  return status(ENABLED_STATUS.map((x, i) => ({ label: x, value: i + 1 })))
}

export function normalStatus(): FormState {
  return status(NORMAL_STATUS.map((x, i) => ({ label: x, value: i + 1 })))
}

export function datetime(): FormState {
  return {
    label: '创建时间',
    type: 'datetime',
    subtype: 'datetime-range',
  }
}

export function region(api: Api): FormState {
  return {
    label: '区域',
    type: 'select',
    addition: {
      allowClear: true,
      dataFrom: api.get('/regions').pipe(parseData, map((array: SimpleObject[]) => array.map(x => ({ label: x.name, value: x.id })))),
    } as SelectAddition,
  }
}

export function platform(api: Api): FormState {
  return {
    label: '云厂商',
    type: 'select',
    addition: {
      allowClear: true,
      dataFrom: api.get('/platform').pipe(parseData, map((array: { platform: string; desc: string }[]) => array.map(x => ({ label: x.desc, value: x.platform })))),
    } as SelectAddition,
  }
}
