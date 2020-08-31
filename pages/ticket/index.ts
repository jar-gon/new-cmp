import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { SelectAddition } from '@billyunq/react-utils/simple-form'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { mapArray } from '~/utils/api'
import { formatDate } from '~/utils/common'
import { datetime } from '~/utils/form'
import { createTicket, ticketDetail } from '~/modals/pages/index'

import TicketApi from '~/apis/ticket'
import { Ticket, TicketStatus } from '~/models/ticket'

import { ConvertTicketStatus } from '~/components/converters/ticket-status'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import FilterForm from '~/components/filter-form'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class TicketList extends ListComponent<ConnectedProps, ListState<Ticket>> {
  ticketApi: TicketApi

  componentDoInit() {
    this.ticketApi = new TicketApi()
  }

  onLoadItems() {
    return this.ticketApi.listTicket({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...this.params,
    }).pipe(this.syncPaging)
  }

  getFilterFormStates() {
    return {
      ticket_id: {
        label: '工单ID',
      },
      sub_question_id: {
        label: '问题分类',
        type: 'select',
        addition: {
          allowClear: true,
          dataFrom: this.ticketApi.listSubCategory().pipe(mapArray(x => ({ label: x.subquestion, value: x.id }))),
        } as SelectAddition,
      },
      status: {
        label: '状态',
        type: 'select',
        addition: {
          allowClear: true,
          data: [
            { label: '已提交', value: TicketStatus.Submitted },
            { label: '已回复', value: TicketStatus.Replied },
            { label: '已完成', value: TicketStatus.Completed },
            { label: '已关闭', value: TicketStatus.Closed },
          ],
        } as SelectAddition,
      },
      datetime: datetime(),
    }
  }

  @autobind()
  createTicket(): void {
    createTicket().afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  @autobind()
  detail(ticket: Ticket): void {
    ticketDetail(ticket).afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, FilterForm, ShortName, formatDate, ConvertTicketStatus })
  }
}

export default TicketList
