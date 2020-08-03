import { createElement } from 'react'
import { Component } from '@billyunq/react-utils/react'

import { strmax } from '~/utils/common'

import template from './short-name.pug'

interface ShortNameProps {
  value: string
  max: number
  suffix: string | false
}

interface ShortNameState {
  value: string
  originValue: string
}

export default class ShortName extends Component<ShortNameProps, ShortNameState> {
  static Id(props: { value: string }) {
    return createElement(ShortName, { value: props.value, max: 8, suffix: false })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value = '', max, suffix } = nextProps
    const { originValue } = prevState
    if (value === originValue) {
      return { }
    }
    return {
      value: strmax(value, max, suffix === false ? false : suffix || '...'),
      originValue: value
    }
  }

  render() {
    return template.call(this, { ...this })
  }
}
