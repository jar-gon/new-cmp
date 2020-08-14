import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import MemberApi from '~/apis/member'
import { Member } from '~/models/member'

import template from './delete-member.pug'

interface DeleteMemberProps {
  member: Member
}

@connect(mapState)
export class DeleteMember extends ModalComponent<ConnectedProps & DeleteMemberProps> {
  @autobind()
  onClose() {
    const memberApi = new MemberApi()
    return memberApi.deleteMember(this.props.member.id).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default DeleteMember
