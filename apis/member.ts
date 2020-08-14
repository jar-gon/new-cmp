/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { PageResult, PageQuery } from '~/models/api'
import { CommonApiClass } from '~/utils/api'
import { CreateMemberData, Member } from '~/models/member'

@CommonApiClass
class MemberApi extends Api {
  createMember(member: CreateMemberData): Observable<string> {
    return this.axios.post('/user', member) as any
  }

  deleteMember(id: string): Observable<void> {
    return this.axios.delete(`/user/${ id }`) as any
  }

  listMember(params?: PageQuery): Observable<PageResult<Member>> {
    return this.axios.get('/member', { params }) as any
  }

  relateResourceGroup(id: string, resourceGroupIds: string[]): Observable<void> {
    return this.axios.post(`/member/${ id }`, { projectIds: resourceGroupIds }) as any
  }

  resetMemberPassword(id: string, password: string, reset: boolean): Observable<void> {
    return this.axios.put(`/user/${ id }/password`, { password, reset }) as any
  }

  updateMember(memberId: string, member: Member): Observable<Member> {
    return this.axios.patch(`/user/${ memberId }/info`, member) as any
  }
}

export default MemberApi
