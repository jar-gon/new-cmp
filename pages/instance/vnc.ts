import { SyntheticEvent } from 'react'
import { withRouter } from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import Notification from '~/utils/notification'

import InstanceApi from '~/apis/instance'

import template from './vnc.pug'

interface InstanceVNCState {
  src: string
  loading: boolean
  error: boolean
}

@withRouter
@connect(mapState)
class InstanceVNC extends Component<ConnectedProps, InstanceVNCState> {
  instanceApi: InstanceApi
  messageId: string

  getInitialState() {
    return {
      loading: true,
    }
  }

  componentDidMount() {
    this.instanceApi = new InstanceApi()
    this.loadVNC()
  }

  @autobind()
  loadVNC(): void {
    this.setState({ error: false })
    if (this.messageId) {
      Notification.close(this.messageId)
      this.messageId = null
    }
    const { endpointId, regionId, instanceId } = this.query as Dictionary<string>
    this.instanceApi.getVNC(instanceId, endpointId, regionId).subscribe(
      url => this.setState({ src: url, loading: false }),
      () => {
        this.setState({ error: true })
        this.messageId = Notification.error('加载失败，请重试', '', {
          className: 'ant-notification--error ant-notification--center',
        })
      },
    )
  }

  @autobind()
  onLoad({ nativeEvent }: SyntheticEvent): void {
    const iframe = nativeEvent.target as HTMLIFrameElement
    iframe.contentWindow.focus()
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default InstanceVNC
