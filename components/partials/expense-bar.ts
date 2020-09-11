import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { Dictionary } from '@billypon/ts-types'
import ReactEcharts from 'echarts-for-react'

import { mapState, ConnectedProps } from '~/utils/redux'
import { CLOUD_VENDORS } from '~/utils/cloud'
import { optionsBar } from '~/utils/dashboard'

import ExpenseApi from '~/apis/expense'
import { Expense, ExpenseParams } from '~/models/expense'

import template from './expense-bar.pug'

function setLegendFormatter(options: Dictionary, expenses: Expense[], selectedObj?: Dictionary): void {
  options.legend.formatter = name => {
    const item = expenses.filter(x => x.name === name)[0]
    const iconClass = !selectedObj ? item.cloud : selectedObj.selected[name] ? item.cloud : `${ item.cloud }Grey`
    const arr = [
      `{${ iconClass }|}`,
      `{name|${ name }}`
    ]
    return arr.join('')
  }
}

export class ExpenseBarRef {
  /* eslint-disable @typescript-eslint/no-empty-function */

  loadItems(): void {
  }

  /* eslint-enable @typescript-eslint/no-empty-function */
}

interface ExpenseBarProps {
  _ref: ExpenseBarRef
  isIndex: boolean
  params: ExpenseParams
}

interface ExpenseBarState {
  expenses: Expense[]
}

@connect(mapState)
class ExpenseBar extends Component<ConnectedProps & ExpenseBarProps, ExpenseBarState> {
  expenseApi: ExpenseApi

  barEchartRef: ReactEcharts

  componentDidMount() {
    const { _ref } = this.props
    this.expenseApi = new ExpenseApi()
    if (_ref) {
      Object.assign(_ref, {
        loadItems: this.loadItems.bind(this)
      })
    }
  }

  loadItems() {
    const { isIndex, params } = this.props
    const expenseOptionsBar = JSON.parse(JSON.stringify(optionsBar))
    const legendData = []
    const xAxisData = []
    const series = []
    this.expenseApi.expenseList(params).subscribe(expenses => {
      this.setState({ expenses })
      if (!expenses.length) {
        return
      }
      const barEchart = this.barEchartRef.getEchartsInstance()
      barEchart.clear()
      expenses.forEach((x, i) => {
        series[i] = {}
        series[i].data = []
        series[i].type = 'bar'
        series[i].stack = 'expense'
        legendData.push(x.name)
        series[i].name = x.name
        x.data.forEach(v => {
          if (!i) {
            xAxisData.push(v.x)
          }
          series[i].data.push(v.value)
        })
      })
      setLegendFormatter(expenseOptionsBar, expenses)
      expenseOptionsBar.legend.textStyle.rich = {
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
        aliyunGrey: {
          width: 15,
          height: 10,
          backgroundColor: {
            image: CLOUD_VENDORS[0].iconGrey
          }
        },
        aws: {
          width: 15,
          height: 10,
          backgroundColor: {
            image: CLOUD_VENDORS[1].icon
          }
        },
        awsGrey: {
          width: 15,
          height: 10,
          backgroundColor: {
            image: CLOUD_VENDORS[1].iconGrey
          }
        }
      }
      if (isIndex) {
        expenseOptionsBar.legend.bottom = '8'
        expenseOptionsBar.grid.top = '20'
        expenseOptionsBar.grid.bottom = '40'
      }
      expenseOptionsBar.legend.data = legendData
      expenseOptionsBar.xAxis.data = xAxisData
      expenseOptionsBar.series = series
      barEchart.setOption(expenseOptionsBar)
      barEchart.on('legendselectchanged', obj => {
        setLegendFormatter(expenseOptionsBar, expenses, obj)
        barEchart.setOption(expenseOptionsBar)
      })
    })
  }

  render() {
    return template.call(this, { ...this, ReactEcharts, optionsBar })
  }
}

export default ExpenseBar
