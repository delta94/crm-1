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
    const pi = this.props.pi
    const figure: any [] = []
    const data = pi && pi.length > 0 && pi.map((item: any, index: any) => {
      if (index < 8) {
        figure.push(item.customerSourceName)
      }
      return {
        value: item.customerSourceNums,
        name: item.customerSourceName
      }
    })
    const option = {
      title: {
        left: '90',
        text: '商机客户空置天数',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: figure,
        bottom: 35
      },
      series: [
        {
          name: '总客户',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fff'
          },
          color: ['#39A0FF', '#37CBCB', '#4ECB73', '#FBD64A', '#F2637B', '#9760E4', '#ca8622', '#bda29a', '#6e7074', '#c4ccd3', '#61a0a8', '#c23531', '#2f4554', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#546570', '#c4ccd3'],
          data
        }
      ]
    }
    if (option && typeof option === 'object') {
      this.chart.setOption(option, true)
    }
  }
  public render () {
    return (
      <div>
        <div ref='line' style={{height: '250px', width: 400, marginBottom: 10, marginLeft: -100}}></div>
      </div>
    )
  }
}
export default Main