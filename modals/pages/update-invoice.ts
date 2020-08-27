import { connect } from 'react-redux/es'
import { SimpleFormModalComponent } from '@billyunq/react-utils/modal'
import SimpleForm, { SimpleFormRef, FormState, InputAddition } from '@billyunq/react-utils/simple-form'
import { FormComponentState, ValidatorFn } from '@billyunq/react-utils/form'
import { requiredBy } from '@billyunq/react-utils/form/validators'
import Template from '@billypon/react-template'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { mapUrlToFile } from '~/utils/common'

import InvoiceApi from '~/apis/invoice'
import { CreateInvoiceData, Invoice, InvoiceType } from '~/models/invoice'

import { INVOICE_TYPES } from '~/components/converters/invoice-type'

import UploadPicture from '~/components/upload-picture'
import template from './create-invoice.pug'

interface UpdateInvoiceProps {
  invoice: Invoice
}

interface UpdateInvoiceState {
  errorMessage: string
}

@connect(mapState)
export class UpdateInvoice extends SimpleFormModalComponent<ConnectedProps & UpdateInvoiceProps, FormComponentState & UpdateInvoiceState> {
  invoiceApi: InvoiceApi
  form = new SimpleFormRef()

  invoiceType: InvoiceType = this.props.invoice.invoice_type

  tipTpl: Template
  imageurlTpl: Template

  getFormStates() {
    const { invoice } = this.props
    const requiredByVat: ValidatorFn = requiredBy(
      () => true,
      (value) => !this.InvoiceTypeIsGeneral() ? !!value : true
    )
    const states: Dictionary<FormState> = {
      invoice: {
        label: '发票信息',
        children: {
          invoice_type: {
            label: '发票类型',
            value: INVOICE_TYPES[invoice.invoice_type],
            type: 'text',
          },
          invoice_title: {
            label: '单位名称',
            value: invoice.invoice_title,
            rules: [
              { required: true, message: '请输入单位名称' },
            ],
            addition: {
              maxlength: 32,
            } as InputAddition,
          },
          tax_number: {
            label: '纳税人识别码',
            value: invoice.tax_number,
            rules: [
              { required: true, message: '请输入纳税人识别码' },
              { pattern: /^[0-9][A-Z0-9]{15,18}$/, message: '请输入正确的纳税人识别码' },
            ],
            addition: {
              maxlength: 18,
            } as InputAddition,
          },
          registered_address: {
            label: '注册地址',
            value: invoice.registered_address,
            hidden: () => this.InvoiceTypeIsGeneral(),
            rules: [
              { validator: requiredByVat, message: '请选择管理员ID' },
            ],
            addition: {
              maxlength: 64,
            } as InputAddition,
          },
          registered_phone: {
            label: '注册电话',
            value: invoice.registered_phone,
            hidden: () => this.InvoiceTypeIsGeneral(),
            rules: [
              { validator: requiredByVat, message: '请输入注册电话' },
              { pattern: /^[0-9-]{8,16}$/, message: '请输入正确的注册电话' },
            ],
            addition: {
              maxlength: 16,
            } as InputAddition,
          },
          open_bank: {
            label: '开户银行',
            value: invoice.open_bank,
            hidden: () => this.InvoiceTypeIsGeneral(),
            rules: [
              { validator: requiredByVat, message: '请输入开户银行' },
            ],
            addition: {
              maxlength: 32,
            } as InputAddition,
          },
          bank_account: {
            label: '银行账户',
            value: invoice.bank_account,
            hidden: () => this.InvoiceTypeIsGeneral(),
            rules: [
              { validator: requiredByVat, message: '请输入银行账户' },
              { pattern: /^[0-9]{12,24}$/, message: '请输入正确的银行账户' },
            ],
            addition: {
              maxlength: 24,
            } as InputAddition,
          },
        }
      },
      receipt: {
        label: '收件信息',
        children: {
          receiver: {
            label: '收件人姓名',
            value: invoice.receiver,
            rules: [
              { required: true, message: '请输入收件人姓名' },
            ],
            addition: {
              maxlength: 32,
            } as InputAddition,
          },
          phone: {
            label: '联系电话',
            value: invoice.phone,
            rules: [
              { required: true, message: '请输入联系电话' },
              { pattern: /^[0-9-]{8,16}$/, message: '请输入正确的联系电话' },
            ],
            addition: {
              maxlength: 16,
            } as InputAddition,
          },
          province: {
            label: '所在省市',
            value: invoice.province,
            rules: [
              { required: true, message: '请输入所在省市' },
            ],
            addition: {
              maxlength: 32,
            } as InputAddition,
          },
          address: {
            label: '详细地址',
            value: invoice.address,
            rules: [
              { required: true, message: '请输入详细地址' },
            ],
            addition: {
              maxlength: 64,
            } as InputAddition,
          },
          imageurl: {
            label: '认定书',
            hidden: () => this.InvoiceTypeIsGeneral(),
            render: {
              control: () => this.imageurlTpl ? this.imageurlTpl.template : '',
            },
          },
          tip: {
            label: '',
            hidden: () => this.InvoiceTypeIsGeneral(),
            render: {
              control: () => this.tipTpl ? this.tipTpl.template : '',
            },
          }
        }
      },
    }
    return states
  }

  componentDidMount() {
    const { imageurl } = this.props.invoice
    this.invoiceApi = new InvoiceApi()
    this.form.setFieldsValue({
      receipt: {
        imageurl: imageurl && mapUrlToFile(imageurl),
      },
    })
  }

  InvoiceTypeIsGeneral(): boolean {
    return this.invoiceType === 'general'
  }

  updateInvoice(invoice: CreateInvoiceData): void {
    this.invoiceApi.updateInvoice(this.props.invoice.id, invoice).subscribe(
      () => {
        this.modal.cancelUpdate = true
        this.modal.cancel()
      },
      ({ retMsg }) => {
        this.setState({ errorMessage: retMsg })
        this.form.setLoading(false).subscribe(() => this.triggerUpdate())
      }
    )
  }

  @autobind()
  onSubmit(values) {
    const invoice: CreateInvoiceData = {
      invoice_type: this.props.invoice.invoice_type,
      invoice_title: values.invoice.invoice_title,
      tax_number: values.invoice.tax_number,
      registered_address: values.invoice.registered_address,
      registered_phone: values.invoice.registered_phone,
      open_bank: values.invoice.open_bank,
      bank_account: values.invoice.bank_account,
      receiver: values.receipt.receiver,
      phone: values.receipt.phone,
      province: values.receipt.province,
      address: values.receipt.address,
    }
    const file = values.receipt.imageurl
    this.setState({ errorMessage: undefined })
    this.form.setLoading(true).subscribe(() => this.triggerUpdate())
    if (file && file.lastModified) {
      this.invoiceApi.uploadFile(file).subscribe(
        ({ imageurl }) => {
          invoice.imageurl = imageurl
          this.updateInvoice(invoice)
        },
        ({ retMsg }) => {
          this.setState({ errorMessage: retMsg })
          this.form.setLoading(false).subscribe(() => this.triggerUpdate())
        }
      )
    } else {
      if (file) {
        invoice.imageurl = file.thumbUrl
      }
      this.updateInvoice(invoice)
    }
  }

  render() {
    return template.call(this, { ...this, SimpleForm, UploadPicture })
  }
}

export default UpdateInvoice
