import { connect } from 'react-redux/es'
import { forkJoin } from 'rxjs'
import { Component } from '@billyunq/react-utils/react'
import ReactEcharts from 'echarts-for-react'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate, strmax } from '~/utils/common'
import { CLOUD_VENDORS } from '~/utils/cloud'
import { CONSUME_DATE, CONSUME_COST, optionsBar, optionsPie } from '~/utils/dashboard'

import IndexApi from '~/apis/index'
import { CostConsume, Endpoint, EndpointConsume, ProductConsume, Summary } from '~/models/index'

import { ConvertCloudType } from '~/components/converters/cloud-type'
import { ConvertCloudIcon } from '~/components/converters/cloud-icon'

import SiteLayout from '~/components/layout'
import Document from '~/components/document'
import Font10 from '~/components/font-10'
import template from './index.pug'

interface IndexState {
  costConsume: CostConsume[]
  consumeDate: string
  consumeType: string
  consumeTypeName: string
  endpointConsume: EndpointConsume[]
  endpoints: Endpoint[]
  endpointLen: number
  productConsume: ProductConsume[]
  summary: Summary
}

@connect(mapState)
class Index extends Component<ConnectedProps, IndexState> {
  indexApi: IndexApi

  costPieEchartRef: ReactEcharts
  productPieEchartRef: ReactEcharts
  barEchartRef: ReactEcharts

  getInitialState() {
    return {
      consumeDate: CONSUME_DATE[0].value,
      consumeType: CONSUME_COST[0].value,
      consumeTypeName: CONSUME_COST[0].label,
      endpointLen: 0,
    }
  }

  componentDidMount() {
    this.indexApi = new IndexApi()
    forkJoin(
      this.indexApi.listEndpoint(),
      this.indexApi.getSummary(),
    ).subscribe(([ endpoints, summary ]) => {
      const endpointLen = endpoints.length > 3 ? 3 : endpoints.length
      this.setState({
        endpoints,
        endpointLen,
        summary,
      })
    })
    this.getCostConsume()
    this.getProductConsume()
    this.getEndpointConsume(this.state.consumeDate)
  }

  getCostConsume(): void {
    const costOptionsPie = JSON.parse(JSON.stringify(optionsPie))
    const legendData = []
    const seriesData = []
    this.indexApi.getCostConsume().subscribe(costConsume => {
      this.setState({ costConsume })
      if (!costConsume.length) {
        return
      }
      costConsume.forEach((x, i) => {
        seriesData[i] = {}
        legendData.push(x.project)
        seriesData[i].value = x.total
        seriesData[i].name = x.project
      })
      costOptionsPie.legend.formatter = name => {
        const item = costConsume.filter(x => x.project === name)[0]
        const arr = [
          `{name|${ strmax(name, 8, '…') }}`,
          `{percent|${ item.percent }%}`,
          `¥${ item.total }`
        ]
        return arr.join('')
      }
      costOptionsPie.legend.data = legendData
      costOptionsPie.legend.textStyle.rich = {
        name: {
          width: 70
        },
        percent: {
          width: 60
        }
      }
      costOptionsPie.series[0].name = '成本中心消费'
      costOptionsPie.series[0].data = seriesData
      this.costPieEchartRef.getEchartsInstance().setOption(costOptionsPie)
    })
  }

  getEndpointConsume(consumeDate): void {
    const endpointOptionsBar = JSON.parse(JSON.stringify(optionsBar))
    const legendData = []
    const xAxisData = []
    const series = []
    this.indexApi.getEndpointConsume(consumeDate).subscribe(endpointConsume => {
      this.setState({ endpointConsume })
      if (!endpointConsume.length) {
        return
      }
      endpointConsume.forEach((x, i) => {
        series[i] = {}
        series[i].data = []
        series[i].type = 'bar'
        series[i].stack = 'consume'
        legendData.push(x.name)
        series[i].name = x.name
        x.data.forEach(v => {
          if (!i) {
            xAxisData.push(v.x)
          }
          series[i].data.push(v.value)
        })
      })
      endpointOptionsBar.legend.formatter = name => {
        const item = endpointConsume.filter(x => x.name === name)[0]
        const arr = [
          `{${ item.cloud }|}`,
          `{name|${ name }}`
        ]
        return arr.join('')
      }
      endpointOptionsBar.legend.textStyle.rich = {
        name: {
          padding: [ 0, 0, 0, 5 ]
        },
        aliyun: {
          width: 15,
          height: 10,
          backgroundColor: {
            image: CLOUD_VENDORS[0].icon
          }
        },
        aws: {
          width: 15,
          height: 10,
          backgroundColor: {
            image: CLOUD_VENDORS[1].icon
          }
        }
      }
      endpointOptionsBar.legend.data = legendData
      endpointOptionsBar.xAxis.data = xAxisData
      endpointOptionsBar.series = series
      this.barEchartRef.getEchartsInstance().setOption(endpointOptionsBar)
    })
  }

  getProductConsume(): void {
    const productOptionsPie = JSON.parse(JSON.stringify(optionsPie))
    const legendData = []
    const seriesData = []
    this.indexApi.getProductConsume().subscribe(productConsume => {
      this.setState({ productConsume })
      if (!productConsume.length) {
        return
      }
      productConsume.forEach((x, i) => {
        seriesData[i] = {}
        legendData.push(x.service)
        seriesData[i].value = x.total
        seriesData[i].name = x.service
      })
      productOptionsPie.legend.formatter = name => {
        const item = productConsume.filter(x => x.service === name)[0]
        const arr = [
          `{name|${ name }}`,
          `${ item.percent }%`
        ]
        return arr.join('')
      }
      productOptionsPie.legend.data = legendData
      productOptionsPie.legend.textStyle.rich = {
        name: {
          width: 156
        }
      }
      productOptionsPie.series[0].name = '产品消费'
      productOptionsPie.series[0].data = seriesData
      this.productPieEchartRef.getEchartsInstance().setOption(productOptionsPie)
    })
  }

  @autobind()
  dateChange(e): void {
    const { value } = e.target
    this.setState({ consumeDate: value, endpointConsume: null })
    this.getEndpointConsume(value)
  }

  @autobind()
  typeChange(e): void {
    const { children, value } = e.item.props
    this.setState({ consumeType: value, consumeTypeName: children })
  }

  render() {
    /* eslint-disable object-property-newline */
    return template.call(this, {
      ...this, Document, SiteLayout, Font10,
      formatCurrency, formatDate,
      ConvertCloudType, ConvertCloudIcon,
      ReactEcharts, optionsBar, optionsPie, CONSUME_DATE, CONSUME_COST,
    })
  }
}

export default Index
