import { connect } from 'react-redux/es'
import { CheckboxOptionType } from 'antd/es/checkbox'
import { forkJoin } from 'rxjs'
import { ModalComponent } from '@billyunq/react-utils/modal'
import SimpleForm, { SimpleFormRef, FormState, CheckboxAddition, InputAddition } from '@billyunq/react-utils/simple-form'
import Template from '@billypon/react-template'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { mobile, email } from '~/utils/validators'

import TicketApi from '~/apis/ticket'
import { Category, CreateTicketData, TicketStatus } from '~/models/ticket'

import UploadPictures from '~/components/upload-pictures'
import template from './create-ticket.pug'

interface CreateTicketState {
  categoryId: string
  subCategoryId: string
  errorMessage: string
}

@connect(mapState([ 'account' ]))
export class CreateTicket extends ModalComponent<ConnectedProps, CreateTicketState> {
  ticketApi: TicketApi
  form = new SimpleFormRef()

  states: Dictionary<FormState>
  categories: Category[]
  subCategories: Category[]

  categoryTpl: Template
  picturesTpl: Template

  componentDidMount() {
    this.ticketApi = new TicketApi()
    this.ticketApi.listCategory().subscribe(categories => {
      this.categories = categories
      this.triggerUpdate()
    })
  }

  initFormStates() {
    const { account } = this.props
    this.states = {
      basic: {
        label: '基本信息',
        children: {
          email: {
            label: '邮箱',
            value: account.email,
            rules: [
              { required: true, message: '请输入邮箱' },
              { pattern: email, message: '请输入正确的邮箱' },
            ],
          },
          mobile: {
            label: '手机',
            value: account.mobile,
            rules: [
              { required: true, message: '请输入手机号码' },
              { pattern: mobile, message: '请输入正确的手机号码' },
            ],
            addition: {
              maxlength: 11,
            } as InputAddition,
          },
        }
      },
      extra: {
        label: '验证信息',
        children: {
          category: {
            label: '分类',
            rules: [
              { validator: this.onValidCategory, message: '请选择问题分类' },
            ],
            addition: {
              decorator: false,
            },
            render: {
              control: () => this.categoryTpl.template,
            }
          },
          notification: {
            label: '通知方式',
            value: [ 'email' ],
            type: 'checkbox',
            subtype: 'group',
            addition: {
              data: [
                { label: '短信通知', value: 'sms' },
                { label: '邮件通知', value: 'email' },
              ] as CheckboxOptionType[],
            } as CheckboxAddition,
          },
        }
      },
      question: {
        label: '问题描述',
        children: {
          description: {
            label: '',
            rules: [
              { required: true, message: '请输入问题描述' },
            ],
            addition: {
              label: false,
              multiline: true,
            } as InputAddition,
          },
          pictures: {
            label: '',
            render: {
              control: () => this.picturesTpl ? this.picturesTpl.template : '',
            },
          },
        }
      },
    }
  }

  updateTicketStatus(id: string, msg_id: string): void {
    this.ticketApi.updateTicketStatus(id, TicketStatus.Submitted, msg_id).subscribe(() => {
      this.modal.cancelUpdate = true
      this.modal.cancel()
    })
  }

  @autobind()
  onValidCategory(rule, value, callback) {
    const { categoryId, subCategoryId } = this.state
    callback(categoryId && subCategoryId ? undefined : rule.message)
  }

  @autobind()
  setCategoryTpl(categoryTpl: Template): void {
    if (!categoryTpl || this.categoryTpl) {
      return
    }
    this.categoryTpl = categoryTpl
    let categoryId: string
    let subCategoryId: string
    let { categories, subCategories } = this
    categoryTpl.afterChange.subscribe(() => {
      if (categoryId !== this.state.categoryId || categories !== this.categories) {
        categoryId = this.state.categoryId
        categories = this.categories
        this.triggerUpdate()
      } else if (subCategoryId !== this.state.subCategoryId || subCategories !== this.subCategories) {
        subCategoryId = this.state.subCategoryId
        subCategories = this.subCategories
        this.triggerUpdate()
      }
    })
    this.triggerUpdate()
  }

  @autobind()
  setCategory(categoryId: string): void {
    this.subCategories = null
    this.setState({
      categoryId,
      subCategoryId: undefined,
    })
    this.ticketApi.listSubCategory(categoryId).subscribe(subCategories => {
      this.subCategories = subCategories
      this.triggerUpdate()
    })
  }

  @autobind()
  setSubCategory(subCategoryId: string): void {
    this.setState({ subCategoryId })
  }

  @autobind()
  onSubmit(values) {
    const { pictures } = values.question
    const data: CreateTicketData = {
      email: values.basic.email,
      mobile: values.basic.mobile,
      sub_question_id: this.state.subCategoryId,
      enable_email: values.extra.notification.includes('email'),
      enable_sms: values.extra.notification.includes('sms'),
      desc: values.question.description,
    }
    this.setState({ errorMessage: undefined })
    this.form.setLoading(true).subscribe(() => this.triggerUpdate())
    this.ticketApi.createTicket(data).subscribe(
      ({ id, msg_id }) => {
        if (pictures && pictures.length) {
          forkJoin(pictures.map(x => this.ticketApi.uploadFile(msg_id, x as unknown as Blob))).subscribe(() => {
            this.updateTicketStatus(id, msg_id)
          })
        } else {
          this.updateTicketStatus(id, msg_id)
        }
      },
      ({ retMsg }) => {
        this.setState({ errorMessage: retMsg })
        this.form.setLoading(false).subscribe(() => this.triggerUpdate())
      },
    )
  }

  render() {
    const { account } = this.props
    if (account && !this.states && this.categoryTpl) {
      this.initFormStates()
    }
    return template.call(this, { ...this, SimpleForm, UploadPictures })
  }
}

export default CreateTicket
