import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { FormState, SelectAddition } from '@billyunq/react-utils/simple-form'
import { Dictionary } from '@billypon/ts-types'
// import Template from '@billypon/react-template'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { extendParams } from '~/utils/common'
// import { extendParams, extendDateRangeParam } from '~/utils/common'
import { CONSUME_COST, CONSUME_DATE, CONSUME_DIMENSION, CONSUME_PAY } from '~/utils/dashboard'
// import Notification from '~/utils/notification'

import { ExpenseParams } from '~/models/expense'

import ExpenseBar, { ExpenseBarRef } from '~/components/partials/expense-bar'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import FilterForm from '~/components/filter-form'
import template from './index.pug'

interface ExpenseListState {
  // rangeFormat: string
  // rangeMode: string[]
  states: Dictionary<FormState>
}

@connect(mapState)
class ExpenseList extends Component<ConnectedProps, ExpenseListState> {
  params: ExpenseParams

  expenseBar: ExpenseBarRef
  filterForm: FilterForm

  // datetimeTpl: Template

  getInitialState() {
    const states: Dictionary<FormState> = {
      dimension: {
        label: '分析维度',
        value: CONSUME_DIMENSION[0].value,
        type: 'select',
        addition: {
          data: CONSUME_DIMENSION.map(x => ({ label: x.label, value: x.value }))
        } as SelectAddition,
      },
      cost: {
        label: '成本计算方式',
        value: CONSUME_COST[0].value,
        type: 'select',
        addition: {
          data: CONSUME_COST.map(x => ({ label: x.label, value: x.value }))
        } as SelectAddition,
      },
      pay: {
        label: '付费方式',
        value: CONSUME_PAY[0].value,
        type: 'select',
        addition: {
          data: CONSUME_PAY.map(x => ({ label: x.label, value: x.value }))
        } as SelectAddition,
      },
      mode: {
        label: '时间粒度',
        value: CONSUME_DATE[0].value,
        type: 'select',
        addition: {
          data: CONSUME_DATE.map(x => ({ label: x.label, value: x.value }))
        } as SelectAddition,
        // onChange: (value) => {
        //   this.filterForm.form.setFieldsValue({ 'datetime': [] })
        //   if (value === 'month') {
        //     this.setState({
        //       rangeFormat: 'YYYY-MM',
        //       rangeMode: [ value, value ]
        //     })
        //   } else {
        //     this.setState({
        //       rangeFormat: 'YYYY-MM-DD',
        //       rangeMode: [ 'date', 'date' ]
        //     })
        //   }
        // }
      },
      // datetime: {
      //   label: '',
      //   render: {
      //     control: () => this.datetimeTpl ? this.datetimeTpl.template : '',
      //   },
      // },
    }
    return {
      states,
      // rangeFormat: 'YYYY-MM',
      // rangeMode: [ 'month', 'month' ],
    }
  }

  componentDidMount() {
    this.expenseBar = new ExpenseBarRef()
    // this.datetimeTpl.syncState(this, () => [ this.state.rangeMode ])
    this.filterForm.form.submit()
  }

  // lockDate(params: ExpenseParams): boolean {
  //   const { mode, start, end } = params
  //   if (start && end) {
  //     const differ = new Date(end).getTime() - new Date(start).getTime()
  //     const compare = (mode === 'month' ? 338 : 30) * 24 * 60 * 60 * 1000
  //     const message = mode === 'month' ? '月维度分析所选时间范围不能超过12个月' : '日维度分析所选时间范围不能超过31天'
  //     if (differ > compare) {
  //       Notification.warning(message)
  //       return true
  //     }
  //   }
  //   return false
  // }

  // @autobind()
  // handlePanelChange(value, mode): void {
  //   const form = this.filterForm.form
  //   if (form.getFieldValue('mode') === 'month') {
  //     form.setFieldsValue({ 'datetime': value })
  //     this.setState({
  //       rangeMode: [ mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1] ]
  //     })
  //   } else {
  //     this.setState({
  //       rangeMode: mode
  //     })
  //   }
  // }

  @autobind()
  protected onFilter(values: Dictionary): void {
    const params = { } as ExpenseParams
    extendParams(params, values)
    // extendDateRangeParam(params, values.datetime)
    this.params = params
    // if (this.lockDate(params)) {
    //   return
    // }
    this.triggerUpdate().subscribe(() => {
      this.expenseBar.loadItems()
    })
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, FilterForm, ExpenseBar })
  }
}

export default ExpenseList
