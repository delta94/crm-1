import React from 'react'
import Profile from '@/modules/common/company-detail/Profile'
import { Tabs } from 'antd'
import AccountInfo from './AccountInfo'
import BusinessInfo from './BusinessInfo'
import BaseInfo from './BaseInfo'
import OrderInfo from './OrderInfo'
import WorkList from './WorkList'
import CompanyList from './CompanyList'
import OperateList from './OperateList'
class Main extends React.Component {
  public callback () {
    console.log('11')
  }
  public render () {
    return (
      <div style={{ width: '700px'}}>
        <Profile />
        <Tabs defaultActiveKey='1' onChange={this.callback}>
          <Tabs.TabPane tab='客户信息' key='1'>
            <div>
              <BaseInfo />
              <BusinessInfo />
              <AccountInfo />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab='订单信息' key='2'>
            <OrderInfo />
          </Tabs.TabPane>
          <Tabs.TabPane tab='工单信息' key='3'>
            <WorkList/>
          </Tabs.TabPane>
          <Tabs.TabPane tab='相关公司' key='4'>
            <CompanyList/>
          </Tabs.TabPane>
          <Tabs.TabPane tab='操作记录' key='5'>
            <OperateList/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
export default Main
