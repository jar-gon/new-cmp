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
