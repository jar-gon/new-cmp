import { withRouter } from 'next/router'
import { Component } from '@billyunq/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState, InputAddition } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import Notification from '~/utils/notification'

import InstanceApi from '~/apis/instance'
import { Instance } from '~/models/instance'

import template from './click-edit.pug'

interface ClickEditProps {
  instance: Instance
  triggerUpdate: () => void
}

interface ClickEditState {
  states: Dictionary<FormState>
  visible: boolean
}

@withRouter
class ClickEdit extends Component<ClickEditProps, ClickEditState> {
  title: string = '编辑名称'
  form = new SimpleFormRef()

  getInitialState() {
    const { instance } = this.props
    const states: Dictionary<FormState> = {
      hostname: {
        label: '',
        value: instance.InstanceName,
        rules: [
          { required: true, message: '长度为2-128个字符' },
          { pattern: /^[a-zA-Z][a-zA-Z\d._\-:]{1,127}$/, message: '长度为2-128个字符，不能以特殊字符及数字开头，只可包含特殊字符中的“.”、“_”、“-”和“:”' },
        ],
        addition: {
          maxlength: 128,
        } as InputAddition,
      },
    }
    return { states }
  }

  @autobind()
  handleVisibleChange(visible): void {
    this.setState({ visible })
  }

  @autobind()
  hide(): void {
    this.setState({ visible: false })
  }

  @autobind()
  onSubmit(values): void {
    const { instance, triggerUpdate } = this.props
    const { hostname } = values
    if (instance.InstanceName === hostname) {
      this.hide()
      return
    }
    const instanceApi = new InstanceApi()
    const { endpointId, regionId } = this.query
    this.form.setLoading(true).subscribe(() => this.triggerUpdate())
    instanceApi.updateName(instance.InstanceId, endpointId, regionId, hostname).subscribe(
      () => {
        this.form.setLoading(false).subscribe(() => this.triggerUpdate())
        instance.InstanceName = hostname
        if (triggerUpdate) {
          triggerUpdate()
        }
        this.hide()
      },
      ({ retMsg }) => {
        this.form.setLoading(false).subscribe(() => this.triggerUpdate())
        Notification.error(retMsg)
      }
    )
  }

  render() {
    return template.call(this, { ...this, SimpleForm })
  }
}

export default ClickEdit
