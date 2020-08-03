/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { CommonApiClass } from '~/utils/api'
import { Account, LoginInfo, ResetToken, ResetTokenInfo, CreateAccountData, ValidateCode } from '~/models/account'

@CommonApiClass
class AccountApi extends Api {
  createAccount(account: CreateAccountData): Observable<string> {
    return this.axios.post('/account', account) as any
  }

  getInfo(): Observable<Account> {
    return this.axios.get('/account/info') as any
  }

  getResetToken(username: string, sessionId: string, scene: string, sig: string, token: string): Observable<ResetToken> {
    const params = { username, sessionId, scene, sig, token }
    return this.axios.get('/account/reset/token', { params }) as any
  }

  getResetTokenInfo(token: string): Observable<ResetTokenInfo> {
    return this.axios.get(`/account/reset/password/${ token }`) as any
  }

  getResetValidateCode(token: string): Observable<ValidateCode> {
    return this.axios.get(`/account/reset/mobile-code/${ token }`) as any
  }

  getValidateCode(mobile: string): Observable<ValidateCode> {
    const params = { mobile }
    return this.axios.get('/account/validatecode', { params }) as any
  }

  login(username: string, password: string, sessionId: string, scene: string, sig: string, token: string): Observable<LoginInfo> {
    const params = { username, password, sessionId, scene, sig, token, mode: 'cmp' }
    return this.axios.get('/account/token', { params }) as any
  }

  logout(token: string): Observable<void> {
    return this.axios.delete(`/account/token/${ token }`) as any
  }

  resetPassword(token: string, password: string, code: string): Observable<void> {
    return this.axios.post<void>(`/account/reset/password/${ token }`, { password, code }) as any
  }

  updateAccount(account: Account): Observable<void> {
    return this.axios.patch('/account', account) as any
  }

  updatePassword(accountId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.axios.patch(`/account/${ accountId }/password`, { oldPassword, newPassword }) as any
  }
}

export default AccountApi
