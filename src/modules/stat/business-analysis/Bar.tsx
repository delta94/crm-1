import React from 'react'

class Main extends React.Component<any> {
  public chart: echarts.ECharts
  public componentDidMount () {
    const dom: any = this.refs.bar
    this.chart = echarts.init(dom)
    window.addEventListener('resize', () => {
      if (this.chart && typeof this.chart === 'object') {
        this.chart.resize()
      }
    })
    this.renderChart()
  }
  public componentDidUpdate () {
    this.renderChart()
  }
  public renderChart () {
    const char = this.props.char
    let max = 0
    char.map((item: any) => {
      if (max < item.statusNums) {
        max = item.statusNums
      }
    })
    max = Math.pow(10, (String(max).length))
    console.log(max, ';max')
    const option: echarts.EChartOption = {
      color: ['#39A0FF'],
      title: {
        text: '商机客户电话状态分布',
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
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: char.map((item: any) => {
          return item.statusName
        }),
        axisLine:{
          lineStyle:{
            color:'#F2F2F2'
          }
        },
        axisLabel: {
          color: '#595959'
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        logBase: 10,
        max,
        min: 1,
        type: 'log',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F2F2F2',
            width: 1,
            type: 'solid'
          }
        },
        axisLine:{
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#2f4554'
          }
        }
      },
      series: [{
        name: '客户数量',
        type: 'bar',
        barWidth: '40',
        data: char.map((item: any) => {
          return item.statusNums
        })
      }]
    }
    if (option && typeof option === 'object') {
      this.chart.setOption(option, true)
    }
  }
  public render () {
    return (
      <div>
        <div ref='bar' style={{height: 300,  width: 600, marginBottom:'10px'}}></div>
      </div>
    )
  }
}
export default Main
