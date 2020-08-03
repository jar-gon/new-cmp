import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import worldJson from 'echarts/map/json/world.json'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { optionsMap } from '~/utils/dashboard'

import SiteLayout from '~/components/layout'
import Document from '~/components/document'
import template from './index.pug'

@connect(mapState)
class Index extends Component<ConnectedProps> {
  mapEchartRef: ReactEcharts

  componentDidMount() {
    echarts.registerMap('world', worldJson)
  }

  @autobind()
  changeMapZoom(type?: boolean): void {
    const mapEchart = this.mapEchartRef.getEchartsInstance()
    const zoom = mapEchart.getOption().geo[0].zoom
    const Minscale = optionsMap.geo.scaleLimit.min
    if (!type && zoom === Minscale) {
      return
    }
    optionsMap.geo.zoom = type ? zoom + 1 : (zoom - 1) < Minscale ? Minscale : zoom - 1
    mapEchart.setOption(optionsMap)
  }

  @autobind()
  resetMapZoom(): void {
    const mapEchart = this.mapEchartRef.getEchartsInstance()
    optionsMap.geo.zoom = 1.2
    if (mapEchart.getOption().geo[0].zoom === optionsMap.geo.zoom) {
      return
    }
    mapEchart.setOption(optionsMap)
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, ReactEcharts, optionsMap })
  }
}

export default Index
