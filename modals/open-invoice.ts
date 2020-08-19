import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import SimpleForm, { FormStates, SelectAddition } from '@billyunq/react-utils/simple-form'
import { FormComponentState } from '@billyunq/react-utils/form'
import Template from '@billypon/react-template'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'
import { formatCurrency } from '~/utils/common'

import { INVOICE_TYPES } from '~/components/converters/invoice-type'

import BillApi from '~/apis/bill'
import InvoiceApi from '~/apis/invoice'
import { Bill } from '~/models/bill'
import { AuditStatus } from '~/models/common'
import { Invoice, InvoiceType } from '~/models/invoice'
import { parsePageData } from '~/utils/api'

import template from './open-invoice.pug'

interface OpenInvoiceProps {
  bill: Bill
}

interface OpenInvoiceState {
  invoices: Invoice[]
  invoiceInfo: Invoice
  selectInvoiceId: string
}

@connect(mapState)
export class OpenInvoice extends SimpleFormModalComponent<ConnectedProps & OpenInvoiceProps, FormComponentState & OpenInvoiceState> {
  billApi: BillApi
  invoiceApi: InvoiceApi

  invoiceType: InvoiceType = 'general'

  totalTpl: Template
  invoiceListTpl: Template
  invoiceInfoTpl: Template

  getFormStates() {
    const { bill } = this.props
    const states: FormStates = {
      invoice_type: {
        label: '发票类型',
        value: 'general',
        type: 'radio',
        addition: {
          data: [
            ...Object.keys(INVOICE_TYPES).map(x => ({ label: INVOICE_TYPES[x], value: x }))
          ]
        } as SelectAddition,
        onChange: (value: InvoiceType) => {
          this.getInvoices(value)
        },
      },
      total: {
        label: '总金额',
        render: {
          control: () => this.totalTpl ? this.totalTpl.template : '',
        },
      },
      start_time: {
        label: '账期',
        value: bill.name,
        type: 'text',
      },
      invoiceId: {
        label: '发票信息',
        render: {
          control: () => this.invoiceListTpl ? this.invoiceListTpl.template : '',
        },
      },
      receiverInfo: {
        label: '收件信息',
        render: {
          control: () => this.invoiceInfoTpl ? this.invoiceInfoTpl.template : '',
        },
      },
    }
    return states
  }

  componentDidMount() {
    this.billApi = new BillApi()
    this.invoiceApi = new InvoiceApi()
    this.getInvoices(this.invoiceType)
    this.invoiceListTpl.syncState(this, () => [ this.state.invoices ])
    this.invoiceInfoTpl.syncState(this, () => [ this.state.invoiceInfo ])
  }

  getInvoices(type: InvoiceType) {
    this.invoiceApi.listInvoice({
      type,
      status: AuditStatus.Audited,
      pagenumber: 1,
      pagesize: 10,
    }).pipe(parsePageData).subscribe(invoices => {
      this.setState({
        invoices,
        invoiceInfo: invoices[0],
        selectInvoiceId: invoices.length ? invoices[0].id : undefined,
      })
    })
  }

  @autobind()
  getInvoiceInfo(selectInvoiceId: string): void {
    const { invoices } = this.state
    const invoiceInfo = invoices.filter(item => item.id === selectInvoiceId)[0]
    this.setState({
      invoiceInfo,
      selectInvoiceId,
    })
  }

  @autobind()
  onClose() {
    const { bill } = this.props
    const { selectInvoiceId } = this.state
    return this.billApi.openInvoice(bill.id, selectInvoiceId).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this, SimpleForm, formatCurrency })
  }
}

export default OpenInvoice
