import router from 'next/router'
import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import worldJson from 'echarts/map/json/world.json'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { optionsMap } from '~/utils/dashboard'
import { updateEndpoint } from '~/modals/index'

import EndpointApi from '~/apis/endpoint'
import ResourceApi from '~/apis/resource'
import { Endpoint } from '~/models/endpoint'
import { Region, ResourceCount } from '~/models/resource'

import { ConvertCloudImg } from '~/components/converters/cloud-img'

import Font10 from '~/components/font-10'
import template from './endpoint-detail.pug'

interface EndpointDetailProps {
  endpoint: Endpoint
}

interface EndpointDetailState {
  endpoint: Endpoint
  regions: Region[]
  resourceCount: ResourceCount
}

@connect(mapState)
export class EndpointDetail extends ModalComponent<ConnectedProps & EndpointDetailProps, EndpointDetailState> {
  endpointApi: EndpointApi
  resourceApi: ResourceApi

  mapEchartRef: ReactEcharts

  componentDidMount() {
    this.endpointApi = new EndpointApi()
    this.resourceApi = new ResourceApi()
    echarts.registerMap('world', worldJson)
    this.getEndpointDetail()
    this.getRegion()
    this.getResourceCount()
  }

  getEndpointDetail(): void {
    const { id } = this.props.endpoint
    this.endpointApi.getEndpoint(id).subscribe(endpoint => this.setState({ endpoint }))
  }

  getRegion(): void {
    const { id } = this.props.endpoint
    this.resourceApi.listRegion(id).subscribe(regions => {
      this.setState({ regions })
    })
  }

  getResourceCount(): void {
    const { id } = this.props.endpoint
    const mapEchart = this.mapEchartRef.getEchartsInstance()
    this.resourceApi.getResourceCount(id).subscribe(resourceCount => {
      const mapSeries = []
      const mapSeries2 = []
      resourceCount.value.map(item => {
        if (item.instancesCount === 0 && item.dbInstancesCount === 0) {
          const index = mapSeries.length
          mapSeries[index] = {}
          mapSeries[index].name = item.regionName
          mapSeries[index].value = [ item.longitude, item.latitude ]
          mapSeries[index].instancesCount = item.instancesCount
          mapSeries[index].dbInstancesCount = item.dbInstancesCount
        } else {
          const index = mapSeries2.length
          mapSeries2[index] = {}
          mapSeries2[index].name = item.regionName
          mapSeries2[index].value = [ item.longitude, item.latitude ]
          mapSeries2[index].instancesCount = item.instancesCount
          mapSeries2[index].dbInstancesCount = item.dbInstancesCount
        }
        return null
      })
      optionsMap.series[0].data = mapSeries
      optionsMap.series[1].data = mapSeries2
      mapEchart.setOption(optionsMap)
      this.setState({ resourceCount })
    })
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
  openConsole(): void {
    const { id } = this.props.endpoint
    const { protocol, host, pathname } = window.location
    window.open(`${ protocol }//${ host }${ pathname }/${ id }/console`)
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

  @autobind()
  toInstance(regionId: string) {
    const { cloud, id } = this.props.endpoint
    this.modal.close()
    router.push(`/instance?cloud=${ cloud }&endpointId=${ id }&regionId=${ regionId }`)
  }

  @autobind()
  update(): void {
    updateEndpoint(this.state.endpoint).afterClose.subscribe(() => {
      this.getEndpointDetail()
      this.modal.cancelUpdate = true
    })
  }

  render() {
    return template.call(this, { ...this, Font10, ReactEcharts, optionsMap, ConvertCloudImg })
  }
}

export default EndpointDetail
