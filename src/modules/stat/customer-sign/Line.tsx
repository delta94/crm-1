import React from 'react'

class Main extends React.Component<any> {
  public chart: echarts.ECharts
  public componentDidMount () {
    const dom: any = this.refs.line
    this.chart = echarts.init(dom)
    this.renderChart()
  }
  public componentDidUpdate () {
    this.renderChart()
  }
  public renderChart () {
    const char = this.props.char
    const option: echarts.EChartOption = {
      title: {
        text: '新增客户趋势图',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333333'
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['新增客户'],
        top: 25
      },
      grid: {
        left: '5%',
        right: '5%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: char.map((item: any) => {
          return item.name
        }),
        axisLine: {
          lineStyle: {
            color: '#F2F2F2'
          }
        },
        axisLabel: {
          color: '#595959'
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F2F2F2',
            width: 1,
            type: 'solid'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        name: '新增客户',
        type: 'line',
        data: char.map((item: any) => {
          return item.value
        }),
        itemStyle: {
          color: '#FAD440'
        },
        areaStyle:{
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(251,211,55,0.4)' // 0% 处的颜色
            }, {
              offset: 0.4, color: 'rgba(251,211,55,0.3)'
            }, {
              offset: 0.6, color: 'rgba(251,211,55,0.2)'
            }, {
              offset: 1, color: 'rgba(251,211,55,0)' // 100% 处的颜色
            }]
          }
        }
      }]
    }
    if (option && typeof option === 'object') {
      this.chart.setOption(option, true)
    }
  }
  public render () {
    return (
      <div>
        <div ref='line' style={{height: 300, marginTop: 20}}></div>
      </div>
    )
  }
}
export default Main