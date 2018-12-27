import React from 'react'

class Main extends React.Component<any> {
  public chart: echarts.ECharts
  public componentDidMount () {
    const dom: any = this.refs.pie
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
    const option: echarts.EChartOption = {
      title: {
        left: '20',
        text: '客户来源分布',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} ({c}, {d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 'center'
        // bottom: 60
      },
      series: [
        {
          name: '客户来源',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['40%', '60%'],
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
          color: ['#39A0FF', '#4ECB73', '#FBD64A', '#37CBCB', '#F2637B', '#9760E4', '#ca8622', '#bda29a', '#6e7074', '#c4ccd3', '#61a0a8', '#c23531', '#2f4554', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#546570', '#c4ccd3'],
          data: [
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
          ]
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
        <div ref='pie' style={{height: 250}}></div>
      </div>
    )
  }
}
export default Main
