import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { datetime, normalStatus } from '~/utils/form'
import { formatDate } from '~/utils/common'
import { createMember, deleteMember, relateResourceGroup, resetMemberPassword, updateMember } from '~/modals/index'

import MemberApi from '~/apis/member'
import { Member } from '~/models/member'

import { ConvertNormalStatus } from '~/components/converters/normal-status'

import Document from '~/components/document'
import FilterForm from '~/components/filter-form'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class MemberList extends ListComponent<ConnectedProps, ListState<Member>> {
  memberApi: MemberApi

  componentDoInit() {
    this.memberApi = new MemberApi()
  }

  onLoadItems() {
    return this.memberApi.listMember({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...this.params,
    }).pipe(this.syncPaging)
  }

  getFilterFormStates() {
    return {
      id: {
        label: '用户ID',
      },
      username: {
        label: '用户名',
      },
      mobile: {
        label: '手机',
      },
      email: {
        label: '邮箱',
      },
      status: normalStatus(),
      datetime: datetime(),
    }
  }

  @autobind()
  createMember(): void {
    createMember().afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  deleteMember(member: Member): void {
    deleteMember(member).afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  relate(member: Member): void {
    relateResourceGroup('member', member).afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  resetPassword(member: Member): void {
    resetMemberPassword(member)
  }

  @autobind()
  update(member: Member): void {
    updateMember(member).afterClose.subscribe(() => this.loadItems())
  }

  render() {
    return template.call(this, { ...this, Document, FilterForm, ShortName, formatDate, ConvertNormalStatus })
  }
}

export default MemberList
