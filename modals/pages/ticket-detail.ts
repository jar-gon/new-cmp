import { ChangeEvent } from 'react'
import { connect } from 'react-redux/es'
import { UploadFile } from 'antd/es/upload/interface'
import { RadioChangeEvent } from 'antd/es/radio'
import { forkJoin } from 'rxjs'
import { ModalComponent } from '@billyunq/react-utils/modal'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import Notification from '~/utils/notification'
import { formatDate } from '~/utils/common'
import { completeTicket } from '~/modals/index'

import TicketApi from '~/apis/ticket'
import { Ticket, TicketStatus, TicketMessageType } from '~/models/ticket'

import UploadPictures from '~/components/upload-pictures'
import template from './ticket-detail.pug'

interface TicketDetailProps {
  ticket: Ticket
}

interface TicketDetailState {
  ticket: Ticket
  message: string
  messageDirty: boolean
  pictures: UploadFile[]
  rateLevel: number
  rateMessage: string
  rateMessageDirty: boolean
  isLoading: boolean
}

@connect(mapState)
export class TicketDetail extends ModalComponent<ConnectedProps & TicketDetailProps, TicketDetailState> {
  ticketApi: TicketApi

  ticketCategories: string[] = [ ]
  rateLevels = [
    { label: '非常满意', value: 4 },
    { label: '满意', value: 3 },
    { label: '一般', value: 2 },
    { label: '不满意', value: 1 },
  ]

  rateContainer: HTMLDivElement

  getInitialState() {
    return {
      pictures: [ ],
      rateLevel: 4,
    }
  }

  componentDidMount() {
    this.ticketApi = new TicketApi()
    this.loadItem()
  }

  loadItem() {
    const { id } = this.props.ticket
    this.ticketApi.getTicket(id).subscribe(ticket => {
      ticket.message = ticket.message.filter((x, i) => x.type !== TicketMessageType.Close || (ticket.status !== TicketStatus.Closed ? false : i + 1 >= ticket.message.length))
      this.setState({ ticket })
      if (!this.ticketCategories.length) {
        this.ticketApi.getTicketCategory(id).subscribe(categories => {
          this.ticketCategories = categories
          this.triggerUpdate()
        })
      }
    })
  }

  resetStatus(): void {
    this.setState({
      message: null,
      messageDirty: false,
      pictures: [ ],
      rateLevel: 4,
      rateMessage: null,
      rateMessageDirty: false,
      isLoading: false,
    })
    this.modal.cancelUpdate = true
  }

  updateTicketStatus(id: string, msg_id: string): void {
    this.ticketApi.updateTicketStatus(id, TicketStatus.Submitted, msg_id).subscribe(() => {
      this.loadItem()
      this.resetStatus()
    })
  }

  @autobind()
  complete(): void {
    const { ticket } = this.state
    completeTicket(ticket.id).afterClose.subscribe(() => {
      ticket.status = TicketStatus.Completed
      this.resetStatus()
      this.rateContainer.scrollIntoView()
    })
  }

  @autobind()
  rate(): void {
    const { ticket, rateLevel, rateMessage } = this.state
    this.setState({ messageDirty: true })
    if (!rateMessage && rateLevel <= 1) {
      return
    }
    this.setState({ isLoading: true })
    this.ticketApi.rateTicket(ticket.id, rateLevel, rateLevel <= 1 ? rateMessage : '').subscribe(
      () => {
        this.loadItem()
        this.resetStatus()
      },
      ({ retMsg }) => {
        this.setState({ isLoading: false })
        Notification.error(retMsg)
      },
    )
  }

  @autobind()
  reply(): void {
    const { ticket, message, pictures } = this.state
    this.setState({ messageDirty: true })
    if (!message) {
      return
    }
    this.setState({ isLoading: true })
    this.ticketApi.createReply(ticket.id, message).subscribe(
      ({ msg_id }) => {
        if (pictures.length) {
          forkJoin(pictures.map(x => this.ticketApi.uploadFile(msg_id, x as unknown as Blob))).subscribe(() => {
            this.updateTicketStatus(ticket.id, msg_id)
          })
        } else {
          this.updateTicketStatus(ticket.id, msg_id)
        }
      },
      ({ retMsg }) => {
        this.setState({ isLoading: false })
        Notification.error(retMsg)
      },
    )
  }

  @autobind()
  setMessage({ target: { value } }: ChangeEvent<HTMLInputElement>): void {
    this.setState({ message: value, messageDirty: true })
  }

  @autobind()
  setPictures(pictures: UploadFile[]): void {
    this.setState({ pictures })
  }

  @autobind()
  setRateLevel({ target: { value } }: RadioChangeEvent): void {
    this.setState({ rateLevel: value })
  }

  @autobind()
  setRateMessage({ target: { value } }: ChangeEvent<HTMLInputElement>): void {
    this.setState({ rateMessage: value, rateMessageDirty: true })
  }

  render() {
    return template.call(this, { ...this, UploadPictures, formatDate, TicketStatus })
  }
}

export default TicketDetail
