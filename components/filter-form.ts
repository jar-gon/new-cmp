import Form from 'antd/es/form'
import { Component } from '@billyunq/react-utils/react'
import { SimpleForm, SimpleFormRef, FormState } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import template from './filter-form.pug'

const WrappedSimpleForm = Form.create({ name: 'filter-form ' })(SimpleForm)

interface FormFilterProps {
  hideClearBtn: boolean
  states: Dictionary<FormState>
  onSubmit: (values: Dictionary) => void
  onReset: () => void
}

export default class FilterForm extends Component<FormFilterProps> {
  form = new SimpleFormRef()

  @autobind()
  resetFields(): void {
    this.form.resetFields()
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    return this.props.states ? template.call(this, { ...this, SimpleForm: WrappedSimpleForm }) : ''
  }
}
