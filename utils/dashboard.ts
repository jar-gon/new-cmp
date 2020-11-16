export const CONSUME_COST = [
  { label: '订单支出', value: 'expend' },
  { label: '逐期分摊', value: 'share' }
]

export const CONSUME_DATE = [
  { label: '月', value: 'month' },
  { label: '日', value: 'day' }
]

export const CONSUME_DIMENSION = [
  { label: '账号', value: 'endpoint' },
  // { label: '云厂商', value: 'provider' },
  { label: '产品', value: 'product' },
  { label: '区域', value: 'region' },
  { label: '成本中心', value: 'cost' }
]

export const CONSUME_PAY = [
  { label: '全部', value: 'all' },
  { label: '预付费(包年包月)', value: 'prepayment' },
  { label: '后付费(按量付费)', value: 'postpaid' }
]

export const optionsColor = [
  '#e8684a', '#f7931e', '#5b8ff9', '#ff99c3', '#269a99', '#ff9d4d', '#6c5496', '#6dc8ec', '#f6bd16', '#4a6494', '#5ad8a6', '#5d7092',
  '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'
]

export const optionsBar = {
  color: optionsColor,
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    itemWidth: 12,
    itemHeight: 6,
    formatter: name => {
      return name
    },
    inactiveColor: '#b4b4b4',
    textStyle: {
      color: '#525f7f',
      rich: { }
    },
    data: [ ]
  },
  grid: {
    top: '16%',
    left: 0,
    right: 0,
    bottom: 'auto',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#525f7f'
    },
    data: [ ]
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#525f7f',
      formatter: '￥ {value}'
    },
    splitLine: {
      lineStyle: {
        color: '#e9e9e9'
      }
    }
  },
  series: [ ]
}

export const optionsMap = {
  tooltip: {
    trigger: 'item',
    formatter: params => {
      return `<span style='display: inline-block; margin-right: 8px; width: 0px; height 0px; border-radius: 6px; border: 6px solid #f7931e;'></span>
        <span style='display: inline-block; width: 88px;'>主机总数</span>${ params.data.instancesCount }
        <br/>
        <span style='display: inline-block; margin-right: 8px; width: 0px; height 0px; border-radius: 6px; border: 6px solid #525f7f;'></span>
        <span style='display: inline-block; width: 88px;'>数据库总数</span>${ params.data.dbInstancesCount }`
    },
    backgroundColor: '#fff',
    padding: 8,
    textStyle: {
      color: '#32325d'
    },
    extraCssText: 'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);'
  },
  geo: {
    map: 'world',
    itemStyle: {
      normal: {
        borderWidth: 0.2,
        borderColor: '#404a59'
      },
      emphasis: {
        areaColor: '#f7931e' // hover背景色
      }
    },
    roam: true,
    zoom: 1.2,
    center: [ 20, 12 ],
    scaleLimit: {
      min: 1
    }
  },
  series: [
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      data: [],
      activeOpacity: 1,
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#fff',
          color: '#577ceb'
        }
      },
    },
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: [],
      activeOpacity: 1,
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          show: true
        }
      },
      hoverAnimation: true,
      symbolSize: 14,
      rippleEffect: {
        brushType: 'stroke'
      },
      itemStyle: {
        normal: {
          borderColor: '#fff',
          color: '#afd15c',
          shadowBlur: 10,
          shadowColor: '#fff'
        }
      },
      zlevel: 1
    }
  ]
}

export const optionsPie = {
  color: optionsColor,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : ￥{c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    top: 'middle',
    right: 'right',
    itemWidth: 12,
    itemHeight: 8,
    formatter: name => {
      return name
    },
    inactiveColor: '#b4b4b4',
    textStyle: {
      color: '#525f7f'
    },
    icon: 'circle',
    data: [ ]
  },
  series: [
    {
      type: 'pie',
      label: {
        show: false
      },
      radius: '86%',
      center: [ '24%', '50%' ],
      // color: optionsColor,
      data: [ ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
