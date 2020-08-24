import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import template from './click-copy.pug'

interface ClickCopyProps {
  content: string
}

interface ClickCopyState {
  isCopied: boolean
}

class ClickCopy extends Component<ClickCopyProps, ClickCopyState> {
  @autobind()
  copy(): void {
    this.setState({ isCopied: true })
  }

  @autobind()
  mouseenter(): void {
    const { isCopied } = this.state
    if (!isCopied) {
      return
    }
    this.setState({ isCopied: false })
  }

  render() {
    return template.call(this, { ...this, CopyToClipboard })
  }
}

export default ClickCopy
