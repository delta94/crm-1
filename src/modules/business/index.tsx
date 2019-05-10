import React from 'react'
import { DatePicker, Select, Tabs, Icon } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import ContentBox from '@/modules/common/content'
import Condition from '@/modules/common/search/Condition'
import SearchName from '@/modules/common/search/SearchName'
import Modal from 'pilipa/libs/modal'
import SelectSearch from './SelectSearch'
import AddButton from '@/modules/common/content/AddButton'
import ToOpenReason from './ToOpenReason'
import Provider from '@/components/Provider'
import Import from '@/modules/business/import'
import Shrink from 'pilipa/libs/shrink'
import { fetchRegion, getSalesByCompany } from '@/modules/common/api'
import moment from 'moment'
import TQAD from '@/modules/common/content/TQAD'
import Tab2 from './Tab2'
import Tab3 from './Tab3'
import Tab4 from './Tab4'
import {
  addCustomer,
  getColumns,
  conditionOptions
} from './utils'
import _ from 'lodash'
import { appointment, toSales, toOpen, toCity, fetchList } from './api'
import { fetchCountAction } from './action'
import { connect } from 'react-redux'
const styles = require('./style')
interface States {
  extshow: boolean
  citys: Common.RegionProps[],
  sales: Array<{id: string, name: string}>
}
type Props = RouteComponentProps & Business.Props
class Main extends React.Component<Props> {
  public state: States = {
    extshow: false,
    citys: [],
    sales: []
  }
  public data = conditionOptions
  public params: Business.SearchProps = {tab: '3'}
  public appointmentTime: string = ''
  public curSale: {key: string, label: string} = { key: '', label: ''}
  public city: {key: string, label: string } = { key: APP.user.cityCode, label: APP.user.city }
  public reason: {value: string, label: string} = { value: '', label: ''}
  public columns = getColumns.call(this)
  public componentWillMount () {
    this.fetchCount()
    this.fetchCitys()
    this.fetchSales()
    // 销售看板 点击公司 需要查询当前公司信息 通过路由隐式穿参
    const state = this.props.location.state || {}
    console.log(state, '1111')
    if (state && state.name) {
      this.handleSearchType({value: state.name, key: 'customerName'})
    }
  }
  public componentWillUnmount () {
    APP.dispatch({
      type: 'init business data'
    })
  }
  public fetchCount () {
    fetchCountAction(this.params)
  }
  public fetchList () {
    const { selectedTab } = this.props
    const data = this.props[selectedTab]
    const { pagination } = data
    this.params.pageSize = pagination.pageSize
    this.params.pageCurrent = pagination.current
    return fetchList(this.params).then((res) => {
      pagination.total = res.pageTotal
      APP.dispatch<Business.Props>({
        type: 'change business data',
        payload: {
          [selectedTab]: {
            dataSource: res.data,
            pagination,
            searchPayload: this.params
          }
        }
      })
      return res
    })
  }
  public fetchCitys () {
    fetchRegion({level: 2}).then((res) => {
      this.setState({
        citys: res
      })
    })
  }
  public fetchSales () {
    getSalesByCompany(APP.user.companyId).then((res) => {
      this.setState({
        sales: res
      })
    })
  }
  public handleSearch (values: any) {
    this.params.storageBeginDate = undefined
    this.params.storageEndDate = undefined
    this.params.createBeginDate = undefined
    this.params.createEndDate = undefined
    this.params.lastTrackBeginTime = undefined
    this.params.lastTrackEndTime = undefined
    let beginTime
    let endTime
    if (!values.date.value) {
      beginTime = undefined
      endTime = undefined
    } else if (values.date.value.indexOf('至') > -1) {
      beginTime = values.date.value.split('至')[0]
      endTime = values.date.value.split('至')[1]
    } else {
      beginTime = moment().startOf('day').subtract(values.date.value - 1, 'day').format('YYYY-MM-DD')
      endTime = moment().format('YYYY-MM-DD')
    }
    if (values.date.label === '入库时间') {
      this.params.storageBeginDate = beginTime
      this.params.storageEndDate = endTime
    } else if (values.date.label === '创建时间') {
      this.params.createBeginDate = beginTime
      this.params.createEndDate = endTime
    } else if (values.date.label === '最后跟进') {
      this.params.lastTrackBeginTime = beginTime
      this.params.lastTrackEndTime = endTime
    }
    this.params.intention = values.intention.value || undefined
    this.params.telephoneStatus = values.telephoneStatus.value || undefined
    const { selectedTab } = this.props
    const data = this.props[selectedTab]
    const { pagination } = data
    pagination.current = 1
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        [`${selectedTab}`]: {
          searchPayload: this.params
        }
      }
    })
    this.fetchCount()
    this.fetchList()
  }
  public handleSelectType (values: any) {
    this.params.payTaxesNature = values.payTaxesNature || undefined
    this.params.customerSource = values.customerSource || undefined
    this.params.currentSalespersonId = values.currentSalespersonId || undefined
    const { selectedTab } = this.props
    const data = this.props[selectedTab]
    const { pagination } = data
    pagination.current = 1
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        [`${selectedTab}`]: {
          searchPayload: this.params
        }
      }
    })
    this.fetchCount()
    this.fetchList()
  }
  public handleSearchType (values: {key: string, value?: string}) {
    const { selectedTab } = this.props
    const data = this.props[selectedTab]
    const { pagination } = data
    pagination.current = 1
    this.params.customerName = undefined
    this.params.contactPerson = undefined
    this.params[values.key] = values.value || undefined
    this.params.tab = selectedTab.replace('tab', '')
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        [`${selectedTab}`]: {
          searchPayload: this.params
        }
      }
    })
    this.fetchCount()
    this.fetchList()
  }
  public callback (value?: 'tab1' | 'tab2' | 'tab3' | 'tab4' | 'tab5' | 'tab6') {
    this.params.tab = value.replace('tab', '')
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        selectedTab: value
      }
    })
  }
  public handleSelectKeys () {
    const { selectedTab } = this.props
    const ins: any = this.refs[selectedTab]
    console.log(ins, 'ins12344')
    if (ins && ins.initSelectedRowKeys) {
      ins.initSelectedRowKeys()
    }
  }
  public appointmentAll (selectedRowKeys: string[]) {
    if (!selectedRowKeys.length) {
      APP.error('请选择客户！')
      return false
    }
    const modal = new Modal({
      content: (
        <div>
          <span>请选择预约时间：</span>
          <DatePicker
            placeholder=''
            format={'YYYY-MM-DD'}
            onChange={(current) => {
              this.appointmentTime = current.format('YYYY-MM-DD')
            }}
          />
        </div>
      ),
      title: '批量预约',
      mask: true,
      maskClosable: false,
      onOk: () => {
        if (!this.appointmentTime) {
          APP.error('请选择预约时间！')
          return false
        }
        const params = { customerIdArr: selectedRowKeys }
        console.log(params, 'params')
        const time = this.appointmentTime
        appointment(params, time).then(() => {
          this.fetchCount()
          this.fetchList()
          APP.success('预约成功')
          this.handleSelectKeys()
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public toSale (selectedRowKeys: string[]) {
    if (!selectedRowKeys.length) {
      APP.error('请选择客户！')
      return false
    }
    const modal = new Modal({
      content: (
        <div>
          <span>请选择销售：</span>
          <Select
            showSearch
            optionFilterProp='children'
            filterOption={(input, option) => String(option.props.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            labelInValue
            style={{width:'200px'}}
            onChange={(val: {key: '', label: ''}) => {
              this.curSale = val
            }}
          >
            {
              this.state.sales.map((item, index) => {
                return (
                  <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                )
              })
            }
          </Select>
        </div>
      ),
      title: '销售',
      mask: true,
      maskClosable: false,
      onOk: () => {
        if (!this.curSale.key) {
          APP.error('请选择销售！')
          return false
        }
        const saleparams = {
          customerIdArr: selectedRowKeys,
          salesperson: this.curSale.label
        }
        const saleId = this.curSale.key
        toSales(saleparams, saleId).then((res) => {
          this.fetchCount()
          this.fetchList()
          APP.success('操作成功')
          this.handleSelectKeys()
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public toOpen (selectedRowKeys: string[]) {
    if (!selectedRowKeys.length) {
      APP.error('请选择客户！')
      return false
    }
    const modal = new Modal({
      content: (
        <ToOpenReason
          onOk={(item) => {
            console.log(item)
            const openparams = {
              customerIdArr: selectedRowKeys,
              bus_sea_memo: this.reason.label
            }
            console.log(selectedRowKeys, 'selectedRowKeys1234543')
            toOpen(openparams).then(() => {
              this.fetchCount()
              this.fetchList()
              APP.success('操作成功')
              modal.hide()
              this.handleSelectKeys()
            })
          }}
          onCancel={() => {
            modal.hide()
          }}
        />
      ),
      title: '转公海',
      mask: true,
      maskClosable: false,
      footer: null,
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public toCustomersCity (selectedRowKeys: string[]) {
    if (!selectedRowKeys.length) {
      APP.error('请选择客户！')
      return false
    }
    const modal = new Modal({
      content: (
        <div>
          <span>请选择客资池：</span>
          <Select
            labelInValue
            style={{width:'200px'}}
            value={this.city}
            onChange={(val: {key: string, label: string, code?: string, name?: string}) => {
              this.city = val
            }}
          >
            {
              this.state.citys.map((item, index) => {
                return (
                  <Select.Option key={item.code}>{item.name}</Select.Option>
                )
              })
            }
          </Select>
        </div>
      ),
      title: '转客资池',
      mask: true,
      maskClosable: false,
      onOk: () => {
        if (!this.city) {
          APP.error('请选择客资池！')
          return false
        }
        const cityparams = {
          customerIdArr: selectedRowKeys,
          cityCode: this.city.key,
          cityName: this.city.label
        }
        toCity(cityparams).then((res) => {
          this.fetchCount()
          this.fetchList()
          APP.success('操作成功')
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public add () {
    addCustomer.call(this)
  }
  public import () {
    const modal = new Modal({
      style: 'width: 800px',
      content: (
        <Provider><Import /></Provider>
      ),
      footer: null,
      title: '导入客资',
      mask: true,
      maskClosable: false,
      onCancel: () => {
        modal.hide()
        this.fetchList()
        this.fetchCount()
      }
    })
    modal.show()
  }
  /**
   * 操作处理
   * type === 1 批量预约
   * type === 2 转销售
   * type === 3 转公海
   * type === 4 转客资池
   */
  public handleSelectAll (selectedRowKeys: string[], type: number) {
    console.log(type)
    console.log(selectedRowKeys)
    if (!selectedRowKeys.length) {
      APP.error('请选择客户')
      return
    }
    if (type === 1) {
      this.appointmentAll(selectedRowKeys)
    } else if (type === 2) {
      this.toSale(selectedRowKeys)
    } else if (type === 3) {
      this.toOpen(selectedRowKeys)
    } else if (type === 4) {
      this.toCustomersCity(selectedRowKeys)
    }
  }
  // 搜索框折叠
  public handleSwitch () {
    this.setState({
      extshow: !this.state.extshow
    })
  }
  public render () {
    const { count, selectedTab } = this.props
    console.log(selectedTab, 'selectedTab')
    return (
      <ContentBox
        title='我的商机'
        rightCotent={(
          <div>
            <AddButton
              icon={<APP.Icon type='add' />}
              hidden={!APP.hasPermission('crm_business_mine_list_add')}
              style={{marginRight: '10px'}}
              title='新增'
              onClick={() => {
                this.add()
              }}
            />
            <AddButton
              icon={<APP.Icon type='import' />}
              hidden={!APP.hasPermission('crm_business_mine_list_upload')}
              title='导入'
              onClick={() => {
                this.import()
              }}
            />
          </div>
        )}
      >
        {
          count[4] === 0 &&
          <div className={styles.note}>
            <span className={styles['note-icon1']} />
            <span>您的库容已达上限！</span>
          </div>
        }
        {
          (count[4] > 0 && count[4] < 11) &&
          <div className={styles.note}>
            <span>
              <span className={styles['note-icon1']} />
              <span className='mr10'>库容剩余不足{count[4]}个，即将达到上限！</span>
            </span>
          </div>
        }
        <Shrink
          height={100}
        >
          <Condition
            dataSource={this.data}
            onChange={this.handleSearch.bind(this)}
          />
          <SelectSearch
            onChange={(values) => {
              console.log(values, 'values')
              this.handleSelectType(values)
            }}
          >
            <div style={{display: 'inline-block', width: 290, verticalAlign: 'bottom', margin: '0 5px 0 20px'}}>
              <SearchName
                style={{paddingTop: '5px'}}
                options={[
                  { value: 'customerName', label: '客户名称'},
                  { value: 'contactPerson', label: '联系人'},
                  { value: 'contactPhone', label: '联系电话'}
                ]}
                placeholder={''}
                onKeyDown={(e, val) => {
                  if (e.keyCode === 13) {
                    this.handleSearchType(val)
                  }
                }}
                onSearch={(val) => {
                  this.handleSearchType(val)
                }}
              />
              </div>
          </SelectSearch>
        </Shrink>
        { this.props.visibled &&
          <Tabs
            animated={false}
            defaultActiveKey={selectedTab}
            onChange={this.callback.bind(this)}
          >
            <Tabs.TabPane tab={<span>新客资({count[0]})</span>} key='tab3'>
              {
                selectedTab === 'tab3' && (
                  <Tab3
                    getInstance={(ref) => {
                      this.refs.tab3 = ref
                    }}
                    columns={this.columns}
                    params={this.params}
                    handleSelectAll={this.handleSelectAll.bind(this)}
                  />
                )
              }
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>意向客户({count[1]})</span>} key='tab5'>
              {
                selectedTab === 'tab5' && (
                  <Tab2
                    tabKey='tab5'
                    getInstance={(ref) => {
                      this.refs.tab5 = ref
                    }}
                    columns={this.columns}
                    params={this.params}
                    handleSelectAll={this.handleSelectAll.bind(this)}
                  />
                )
              }
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>无意向客户({count[2]})</span>} key='tab6'>
              {
                selectedTab === 'tab6' && (
                  <Tab2
                    tabKey='tab6'
                    getInstance={(ref) => {
                      this.refs.tab6 = ref
                    }}
                    columns={this.columns}
                    params={this.params}
                    handleSelectAll={this.handleSelectAll.bind(this)}
                  />
                )
              }
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={(
                <span>即将被收回
                  {
                    count[3] > 0 && (
                      <span style={{ color: '#F9B91F'}}>
                        ({`有${count[3]}个客户即将被收回！`})
                      </span>
                    )
                  }
                </span>
              )}
              key='tab4'
            >
              {
                selectedTab === 'tab4' && (
                  <Tab4
                    getInstance={(ref) => {
                      this.refs.tab4 = ref
                    }}
                    columns={this.columns}
                    params={this.params}
                    handleSelectAll={this.handleSelectAll.bind(this)}
                  />
                )
              }
            </Tabs.TabPane>
          </Tabs>}
          <TQAD />
      </ContentBox>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.business
})(Main)
