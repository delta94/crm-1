import React from 'react'
import { Table, Button, Select } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Modal from 'pilipa/libs/modal'
import ContentBox from '@/modules/common/content'
import Condition, { ConditionOptionProps } from '@/modules/common/search/Condition'
import SearchName from '@/modules/common/search/SearchName'
import AddButton from '@/modules/common/content/AddButton'
import Profile from '@/modules/common/company-detail/Profile'
import { DetailProps } from './signed'
import ChooseSales from '@/modules/customer/chooseSales'
import View from './View'
const Option = Select.Option
interface States {
  dataSource: DetailProps[]
  selectedRowKeys: string[]
}
class Main extends React.Component {
  public state: States = {
    dataSource: [],
    selectedRowKeys: []
  }
  public data: ConditionOptionProps[] = [
    {
      field: 'date',
      value: 'all',
      label: ['入库时间', '创建时间'],
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '今天',
          value: 'today'
        },
        {
          label: '7天',
          value: '7d'
        },
        {
          label: '30天',
          value: '30d'
        }
      ],
      type: 'date'
    },
    {
      field: 'date',
      value: '',
      label: ['即将到期'],
      options: [
        {
          label: '一个月',
          value: '1'
        },
        {
          label: '二个月',
          value: '2'
        },
        {
          label: '三个月',
          value: '3'
        }
      ],
      type: 'date'
    },
    {
      label: ['纳税类别'],
      value: '',
      field: 'intention',
      options: [
        {
          label: '小规模',
          value: '1'
        },
        {
          label: '一般人',
          value: '2'
        }
      ]
    }
  ]
  public columns: ColumnProps<DetailProps>[] = [{
    title: '客户名称',
    dataIndex: 'customerName'
  }, {
    title: '联系人',
    dataIndex: 'contactPerson'
  }, {
    title: '地区',
    dataIndex: 'area'
  }, {
    title: '跟进人',
    dataIndex: 'flowPerson'
  }, {
    title: '运营会计',
    dataIndex: 'operatingAccouting'
  }, {
    title: '入库时间',
    dataIndex: 'createTime'
  }, {
    title: '开始账期',
    dataIndex: 'startTime'
  }, {
    title: '预计截至账期',
    dataIndex: 'endTime'
  }, {
    title: '操作',
    render: () => {
      return (
        <a>转跟进人</a>
      )
    }
  }]
  public componentWillMount () {
    const modal = new Modal({
      header: null,
      footer: null,
      content: <Profile />
    })
    // modal.show()
  }
  public onSelectAllChange () {
    console.log('select')
  }
  public toSale () {
    const modal = new Modal({
      content: (
        <div>
          <span>请选择销售：</span>
          <Select
            style={{width:'200px'}}
            onChange={(current) => {
              console.log(current)
            }}
          >
            <Option key='1'>销售1</Option>
            <Option key='2'>销售2</Option>
          </Select>
        </div>
      ),
      title: '销售',
      mask: true,
      onOk: () => {
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public detail () {
    const modal = new Modal({
      content: (
        <View />
      ),
      header: null,
      footer: null,
      mask: true,
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public render () {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectAllChange.bind(this)
    }
    return (
      <ContentBox
        title='签约客户'
      >
        <div className='mb12' style={{ overflow: 'hidden' }}>
          <div className='fl' style={{ width: 740 }}>
            <Condition
              dataSource={this.data}
              onChange={(values) => {
                console.log(values)
              }}
            />
          </div>
          <div className='fr' style={{ width: 290 }}>
            <SearchName
              style={{paddingTop: '5px'}}
              options={[
                {word: '客户名称', type: '0'},
                {word: '联系人', type: '1'},
                {word: '客户来源', type: '2'},
                {word: '所属销售', type: '3'},
                {word: '联系电话', type: '4'},
                {word: '纳税类别', type: '5'}
              ]}
              placeholder={''}
              onChange={(value) => {
                console.log(value)
              }}
            />
          </div>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.state.dataSource}
          rowSelection={rowSelection}
          bordered
          rowKey={'customerId'}
        />
        <div className='mt40'>
          <Button type='primary' onClick={this.toSale.bind(this)}>转跟进人</Button>
          <Button className='ml5' type='primary' onClick={this.detail.bind(this)}>查看签约客户信息</Button>
        </div>
      </ContentBox>
    )
  }
}
export default Main
