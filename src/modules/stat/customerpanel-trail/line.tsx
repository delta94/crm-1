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
        text: '每日趋势图',
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
      grid: {
        left: '4%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: char.map((item: any) => {
          return item.totalDate
        })
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E8E8E8',
            width: 1,
            type: 'solid'
          }
        }
      },
      series: [{
        name: '客户数量',
        type: 'line',
        data: char.map((item: any) => {
          return item.customerNums
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
              offset: 1, color: 'rgba(251,211,55,0.1)' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
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
        <div ref='line' style={{height: '300px',  width: 850, marginBottom:'10px'}}></div>
      </div>
    )
  }
}
export default Main
