import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import InvoiceApi from '~/apis/invoice'
import { Invoice } from '~/models/invoice'

import template from './delete-invoice.pug'

interface DeleteInvoiceProps {
  invoice: Invoice
}

@connect(mapState)
export class DeleteInvoice extends ModalComponent<ConnectedProps & DeleteInvoiceProps> {
  @autobind()
  onClose() {
    const invoiceApi = new InvoiceApi()
    return invoiceApi.deleteInvoice(this.props.invoice.id).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default DeleteInvoice
