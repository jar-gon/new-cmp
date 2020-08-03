import { ReactNode } from 'react'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

interface Font10Props {
  children: ReactNode
}

interface Font10State {
  element: HTMLSpanElement
}

export default class Font10 extends Component<Font10Props, Font10State> {
  @autobind()
  setElement(element: HTMLSpanElement): void {
    this.setState({ element })
  }

  render() {
    const { element } = this.state
    const style = element ? { width: `${ element.offsetWidth * 0.83 }px` } : null
    return (
      <span className="font-10" style={ style }>
        <span ref={ this.setElement } className="font-size_10">{ this.props.children }</span>
      </span>
    )
  }
}
