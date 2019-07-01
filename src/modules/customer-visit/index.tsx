import React from 'react'
import { Select, Tabs } from 'antd'
import classNames from 'classnames'
import Profile from '@/modules/common/company-detail/Profile'
import OrderInfo from './OrderInfo'
import Record from '@/modules/customer/Record'
import WorkList from './WorkList'
import OperateList from './OperateList'
import CustomerVisit from './CustomerVisit'
import OrderVisit from './OrderVisit'
import ServiceVisit from './ServiceVisit'
import { changeCustomerDetailAction } from '@/modules/customer/action'
import Detail from './Customer'
import { saveRecords } from './api'
const styles = require('./style')
interface State {
  anencyId?: string
  customerId?: string
  companyList?: Array<{id?: string, name?: string}>
  customerList?: Array<{id?: string, customerName?: string, agencyName?: string}>
  menu: Array<{value: number, label: string}>
  /** 当前选中的左侧菜单 */
  curKey: number
  /** 填写回访默认tab */
  defaultKey?: string
}
class Main extends React.Component {
  public state: State = {
    curKey: 1,
    defaultKey: '1',
    menu: [{
      value: 1,
      label: '客户信息'
    }, {
      value: 2,
      label: '订单信息'
    }, {
      value: 3,
      label: '工单信息'
    }, {
      value: 4,
      label: '操作'
    }],
    companyList: [{id: '1', name: '北京'}],
    customerList: [{id: '593099308379668480', customerName: '北京', agencyName: '121212'}, {id: '592755525066686464', customerName: '北12京', agencyName: 'aaa'}]
  }
  public fetchData () {
    changeCustomerDetailAction(this.state.customerId)
  }
  public onOk (params: CustomerVisit.Search) {
    params.customerId = this.state.customerId
    console.log(params)
    saveRecords(params).then(() => {
      changeCustomerDetailAction(this.state.customerId)
    })
  }
  public render () {
    return (
      <div className={styles.box}>
        <div className={styles.search}>
          <Select
            className={classNames(styles.select, 'mr5')}
            showSearch
            allowClear
            value={this.state.anencyId}
            placeholder='请选择机构'
            optionFilterProp='children'
            filterOption={(input, option) => String(option.props.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value?: string) => {
              this.setState({
                anencyId: value
              })
            }}
          >
            {
              this.state.companyList.map((item) => {
                return (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                )
              })
            }
          </Select>
          <Select
            className={styles.select}
            showSearch
            allowClear
            value={this.state.customerId}
            placeholder='请输入客户名称/联系电话'
            onChange={(value?: string) => {
              console.log(value, 'value')
              this.setState({
                customerId: value
              }, () => {
                if (this.state.customerId) {
                  this.fetchData()
                }
              })
            }}
          >
            {
              this.state.customerList.map((item) => {
                return (
                  <Select.Option key={item.id}>
                    {
                      this.state.customerId ?
                      <div>
                        <span>{item.customerName}</span>
                        <span>{'(' + item.agencyName + ')'}</span>
                      </div>
                      :
                      <div>
                        <div>{item.customerName}</div>
                        <div className={styles.color}>
                          <span>机构：</span>
                          <span>{item.agencyName}</span>
                        </div>
                      </div>
                    }
                  </Select.Option>
                )
              })
            }
          </Select>
        </div>
        {
          this.state.customerId &&
          <div>
            <div className={styles['top-info']}>
              <Profile type='signed'/>
            </div>
            <div className={classNames('mt15', 'clear')}>
              <div className={classNames(styles['left-con'], 'fl')}>
                <div className='clear'>
                  <div className='fl'>
                    {
                      this.state.menu.length > 0 && this.state.menu.map((item, index) => {
                        return (
                          <div
                            key={item.value}
                            className={classNames(styles.menu, item.value === this.state.curKey ? styles.focus : '')}
                            onClick={() => {
                              this.setState({
                                curKey: item.value
                              })
                            }}
                          >
                            {item.label}
                          </div>
                        )
                      })
                    }
                  </div>
                  {
                    this.state.curKey === 1 &&
                    <div className={classNames(styles.con, 'fl')}>
                      <Detail/>
                    </div>
                  }
                  {
                    this.state.curKey === 2 &&
                    <div className={classNames(styles.con, 'fl')}>
                      <OrderInfo customerId={this.state.customerId}/>
                    </div>
                  }
                  {
                    this.state.curKey === 3 &&
                    <div className={classNames(styles.con, 'fl', 'mt15')}>
                      <WorkList customerId={this.state.customerId}/>
                    </div>
                  }
                  {
                    this.state.curKey === 4 &&
                    <div className={classNames(styles.con, 'fl', 'mt15')}>
                      <OperateList customerId={this.state.customerId}/>
                    </div>
                  }
                </div>
              </div>
              <div className={classNames(styles['right-con'], 'fr')}>
                <div className={styles['visit-con']}>
                  <Tabs defaultActiveKey={this.state.defaultKey} onChange={(key) => {this.setState({defaultKey: key})}}>
                    <Tabs.TabPane tab='客资回访' key='1'>
                      <CustomerVisit onOk={(params: CustomerVisit.Search) => this.onOk(params)}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='订单回访' key='2'>
                      <OrderVisit onOk={(params: CustomerVisit.Search) => this.onOk(params)}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='服务回访' key='3'>
                      <ServiceVisit onOk={(params: CustomerVisit.Search) => this.onOk(params)}/>
                    </Tabs.TabPane>
                  </Tabs>
                </div>
                <div className={classNames(styles['records-con'], 'mt15')}>
                  <Record
                    type='visit'
                    customerId={this.state.customerId}
                    height={180}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
export default Main
