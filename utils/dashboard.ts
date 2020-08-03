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
    scaleLimit: {
      min: 1
    }
  },
  series: [
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      data: [
        {
          'name': '亚太东南 1 (新加坡)',
          'value': [
            '103.859505',
            '1.362788'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '英国 (伦敦)',
          'value': [
            '-0.116835',
            '51.52116'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '香港',
          'value': [
            '114.175202',
            '22.281547'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华北 3 (张家口)',
          'value': [
            '114.902923',
            '40.765151'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '美国西部 1 (硅谷)',
          'value': [
            '-101.029586',
            '36.915109'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '亚太东南 3 (吉隆坡)',
          'value': [
            '101.713876',
            '3.157208'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华南 1 (深圳)',
          'value': [
            '114.063402',
            '22.549791'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '美国东部 1 (弗吉尼亚)',
          'value': [
            '-78.394667',
            '37.584524'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '中东东部 1 (迪拜)',
          'value': [
            '55.30653',
            '25.272395'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '亚太东南 2 (悉尼)',
          'value': [
            '151.208721',
            '-33.858508'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '欧洲中部 1 (法兰克福)',
          'value': [
            '8.682989',
            '50.113324'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '西南1（成都）',
          'value': [
            '104.08038',
            '30.65806'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华北 2（北京）',
          'value': [
            '116.405338',
            '39.909374'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '亚太东南 5 (雅加达)',
          'value': [
            '106.846602',
            '-6.20282'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '亚太南部 1 (孟买)',
          'value': [
            '72.828928',
            '18.979094'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '亚太东北 1 (东京)',
          'value': [
            '139.664852',
            '35.801844'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华东 2 (上海)',
          'value': [
            '121.481115',
            '31.2342'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华北 1 （青岛）',
          'value': [
            '120.386008',
            '36.080861'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        },
        {
          'name': '华东 1 (杭州)',
          'value': [
            '120.209186',
            '30.252832'
          ],
          'instancesCount': 0,
          'dbInstancesCount': 0
        }
      ],
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
      data: [
        {
          'name': '华北 5 (呼和浩特)',
          'value': [
            '111.752062',
            '40.853443'
          ],
          'instancesCount': 1,
          'dbInstancesCount': 0
        }
      ],
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
