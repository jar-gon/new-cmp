import { connect } from 'react-redux/es'
import { forkJoin } from 'rxjs'
import { Component } from '@billyunq/react-utils/react'
import ReactEcharts from 'echarts-for-react'
import { autobind } from '@billypon/react-decorator'
import { Dictionary } from '@billypon/ts-types'

import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate, strmax } from '~/utils/common'
import { CONSUME_COST, CONSUME_DATE, CONSUME_DIMENSION, CONSUME_PAY, optionsPie } from '~/utils/dashboard'

import IndexApi from '~/apis/index'
import { CostConsume, Endpoint, ProductConsume, Summary } from '~/models/index'
import { ExpenseParams } from '~/models/expense'

import { ConvertCloudType } from '~/components/converters/cloud-type'
import { ConvertCloudIcon } from '~/components/converters/cloud-icon'
import ExpenseBar, { ExpenseBarRef } from '~/components/partials/expense-bar'

import SiteLayout from '~/components/layout'
import Document from '~/components/document'
import Font10 from '~/components/font-10'
import template from './index.pug'

interface IndexState {
  costConsume: CostConsume[]
  consumeDate: string
  consumeCost: Dictionary
  endpoints: Endpoint[]
  endpointLen: number
  productConsume: ProductConsume[]
  summary: Summary
}

@connect(mapState)
class Index extends Component<ConnectedProps, IndexState> {
  indexApi: IndexApi
  params: ExpenseParams

  costPieEchartRef: ReactEcharts
  expenseBar: ExpenseBarRef
  productPieEchartRef: ReactEcharts

  getInitialState() {
    return {
      consumeDate: CONSUME_DATE[0].value,
      consumeCost: CONSUME_COST[0],
      endpointLen: 0,
    }
  }

  componentDidMount() {
    this.indexApi = new IndexApi()
    this.expenseBar = new ExpenseBarRef()
    this.params = {
      dimension: CONSUME_DIMENSION[0].value,
      cost: CONSUME_COST[0].value,
      pay: CONSUME_PAY[0].value,
      mode: CONSUME_DATE[0].value,
    }
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
    this.getExpense()
    this.getProductConsume()
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

  getExpense(): void {
    this.triggerUpdate().subscribe(() => {
      this.expenseBar.loadItems()
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
  costChange(e): void {
    const { value } = e.item.props
    this.setState({ consumeCost: value }).subscribe(() => {
      this.params.cost = value.value
      this.getExpense()
    })
  }

  @autobind()
  dateChange(e): void {
    const { value } = e.target
    this.setState({ consumeDate: value }).subscribe(() => {
      this.params.mode = value
      this.getExpense()
    })
  }

  render() {
    /* eslint-disable object-property-newline */
    return template.call(this, {
      ...this, Document, SiteLayout, Font10,
      formatCurrency, formatDate,
      ConvertCloudType, ConvertCloudIcon, ExpenseBar,
      ReactEcharts, optionsPie, CONSUME_DATE, CONSUME_COST,
    })
  }
}

export default Index
