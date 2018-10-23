import React from 'react'
import { Select, DatePicker } from 'antd'
import moment from 'moment'
import { fetchOverViewAction, fetchOverViewTotalAction } from './action'
import { fetchOwnRegion } from '@/modules/common/api'
import { fetchAgentList } from './api'
const styles = require('./style')
const { MonthPicker } = DatePicker
const Option = Select.Option
const monthFormat = 'YYYY/MM'
const monthFormatYear = 'YYYY'
interface State {
  type: 'MONTH' | 'YEAR'
  provinceList: Common.RegionProps[]
  cityList: Common.RegionProps[]
  agentList: Common.AgentProps[]
}
const years: {label: string, value: string}[] = []
let currentYear = Number(new Date().getFullYear())
while (currentYear >= 2014) {
  years.push({
    label: `${currentYear}年`,
    value: `${currentYear}-01-01`
  })
  currentYear -= 1
}
class Main extends React.Component<{}, State> {
  public payload: Statistics.OverViewSearchPayload = {}
  public state: State = {
    type: 'MONTH',
    provinceList: [],
    cityList: [],
    agentList: []
  }
  public componentWillMount () {
    // this.fetchData()
    fetchOwnRegion().then((res) => {
      this.setState({
        provinceList: res
      })
    })
  }
  public fetchData () {
    if (this.payload.date && this.payload.customerId) {
      fetchOverViewAction(this.payload)
    }
    if (this.payload.customerId) {
      fetchOverViewTotalAction(this.payload.customerId)
    }
  }
  public onProvinceChange (index?: number) {
    if (this.state.provinceList[index]) {
      const res = this.state.provinceList[index].regionLevelResponseList
      this.setState({
        cityList: res || []
      })
    }
  }
  public onCityChange (code?: string) {
    fetchAgentList(code).then((res) => {
      this.setState({
        agentList: res
      })
    })
  }
  public render () {
    const { type, provinceList, cityList, agentList } = this.state
    console.log(cityList, 'cityList')
    return (
      <div className={styles['overview-search']}>
        <Select
          defaultValue='按月查询'
          className={styles.selected}
          style={{width: 120}}
          onChange={(value: 'MONTH' | 'YEAR') => {
            this.payload.dateFlag = value
            this.setState({
              type: value
            })
            this.fetchData()
          }}
        >
          <Option key='MONTH'>
            按月查询
          </Option>
          <Option key='YEAR'>
            按年查询
          </Option>
        </Select>
        {
          type === 'MONTH' ? (
            <MonthPicker
              placeholder='请选择月份'
              className={styles.selected}
              format={monthFormat}
              onChange={(current) => {
                this.payload.date = current.format('YYYY-MM-DD')
                this.fetchData()
              }}
            />
          ) : (
            <Select
              style={{width: '100px'}}
              className={styles.selected}
              onChange={(value: string) => {
                this.payload.date = value
                this.fetchData()
              }}
            >
              {
                years.map((item) => {
                  return (
                    <Option key={item.value}>{item.label}</Option>
                  )
                })
              }
            </Select>
          )
        }
        <Select
          style={{width: '100px'}}
          placeholder='请选择省份'
          className={styles.selected}
          onChange={this.onProvinceChange.bind(this)}
        >
          {
            provinceList.map((item, index) => {
              return (
                <Option key={index}>{item.name}</Option>
              )
            })
          }
        </Select>
        <Select
          style={{width: '100px'}}
          placeholder='请选择城市'
          className={styles.selected}
          onChange={this.onCityChange.bind(this)}
        >
          {
            cityList.map((item) => {
              return (
                <Option key={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>
        <Select
          style={{width: '100px'}}
          placeholder='请选择代理商'
          className={styles.selected}
          onChange={(id: number) => {
            this.payload.customerId = id
            this.fetchData()
          }}
        >
          {
            agentList.map((item) => {
              return (
                <Option key={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>
      </div>
    )
  }
}
export default Main
