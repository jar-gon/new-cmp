import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import TicketApi from '~/apis/ticket'
import { TicketStatus } from '~/models/ticket'

import template from './complete-ticket.pug'

interface CompleteTicketProps {
  ticketId: string
}

@connect(mapState)
class CompleteTicket extends ModalComponent<ConnectedProps & CompleteTicketProps> {
  onClose() {
    const { ticketId } = this.props
    const ticketApi = new TicketApi()
    return ticketApi.updateTicketStatus(ticketId, TicketStatus.Completed).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default CompleteTicket
