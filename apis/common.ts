import Axios from 'axios-observable'
import { AxiosRequestConfig } from 'axios'
import { Observable } from 'rxjs'
import { useInterceptors } from '@billyunq/react-utils/axios'
import { parseResponse } from '@billyunq/react-utils/ajax'
import { browser, replaceToLogout, getLogoutUrl } from '@billyunq/react-utils/common'
import { Dictionary } from '@billypon/ts-types'

import { session } from '~/utils/session'
import { storage, checkLogin } from '~/utils/storage'
import { publicRuntimeConfig } from '~/utils/config'
import { INVALID_TOKEN } from '~/utils/api-errors'

export function uploadFile(axios: Axios, dirname: string, files: Blob[]): Observable<{ uri: string }[]> {
  const data = new FormData
  data.append('path', dirname)
  files.forEach(file => data.append('files', file))
  data.append('permission', 'public-read')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return axios.put('/bucket_files', data) as any
}

export function deleteFile(axios: Axios, dirname: string, filename: string): Observable<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return axios.delete('/bucket_files', { data: { path: dirname, file_name: filename } }) as any
}

export default class {
  protected axios: Axios

  constructor() {
    let headers: Dictionary
    if (browser || checkLogin()) {
      headers = {
        'Yunq-Authenticate': storage.token,
      }
    }
    this.axios = Axios.create({ baseURL: this.getBaseUrl(), headers })
    useInterceptors(this.axios)
    this.axios.interceptors.response.use(null, err => {
      const { retCode } = err || { } as Dictionary
      if (retCode === INVALID_TOKEN) {
        if (session.initialized) {
          replaceToLogout()
        } else {
          window.location.replace(getLogoutUrl())
        }
      }
      return Promise.reject(err)
    })
  }

  getBaseUrl(): string {
    return publicRuntimeConfig.api
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config).pipe(parseResponse)
  }
}
