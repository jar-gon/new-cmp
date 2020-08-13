import { withRouter } from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import Notification from '~/utils/notification'

import EndpointApi from '~/apis/endpoint'

import template from './console.pug'

interface EndpointConsoleState {
  loading: boolean
  error: boolean
}

@withRouter
@connect(mapState)
class EndpointConsole extends Component<ConnectedProps, EndpointConsoleState> {
  endpointApi: EndpointApi
  messageId: string

  getInitialState() {
    return {
      loading: true,
    }
  }

  componentDidMount() {
    this.endpointApi = new EndpointApi()
    this.loadConsole()
  }

  @autobind()
  loadConsole(): void {
    this.setState({ error: false })
    if (this.messageId) {
      Notification.close(this.messageId)
      this.messageId = null
    }
    this.endpointApi.getConsole(this.query._id).subscribe(
      res => {
        this.setState({ loading: false })
        window.location.href = res.url
      },
      () => {
        this.setState({ error: true })
        this.messageId = Notification.error('加载失败，请重试', '', {
          className: 'ant-notification--error ant-notification--center',
        })
      },
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default EndpointConsole
