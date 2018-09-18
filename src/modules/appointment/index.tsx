import React from 'react'
import { Table, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { DetailProps } from './appointment'
import ContentBox from '@/modules/common/content'
interface States {
  dataSource: DetailProps[]
  selectedRowKeys: string[]
}
class Main extends React.Component {
  public state: States = {
    dataSource: [],
    selectedRowKeys: []
  }
  public columns: ColumnProps<DetailProps>[] = [{
    title: '客户名称',
    dataIndex: 'customerName'
  }, {
    title: '联系人',
    dataIndex: 'contactPerson'
  }, {
    title: '联系电话',
    dataIndex: 'contactPhone'
  }, {
    title: '意向度',
    dataIndex: 'can'
  }, {
    title: '跟进次数',
    dataIndex: 'flowtime'
  }, {
    title: '空置天数',
    dataIndex: 'vacantDays'
  }, {
    title: '客户来源',
    dataIndex: 'customerSource'
  }, {
    title: '入库时间',
    dataIndex: 'createTime'
  }, {
    title: '当前销售',
    dataIndex: 'leadingPerson'
  }]
  public onSelectAllChange () {
    console.log('select')
  }
  public render () {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectAllChange.bind(this)
    }
    return (
      <ContentBox title='我的预约'>
        <Table
          columns={this.columns}
          dataSource={this.state.dataSource}
          rowSelection={rowSelection}
          bordered
          rowKey={'customerId'}
        />
        <div className='mt40'>
          <Button type="primary" className='mr10'>批量预约</Button>
          <Button type="primary" className='mr10'>转销售</Button>
          <Button type="primary" className='mr10'>转客资池</Button>
        </div>
      </ContentBox>
    )
  }
}
export default Main
