import React from 'react'
import { Table, Button, Row, Col } from 'antd'
import SearchForm from '@/modules/outsite/components/SearchForm'
import HCframe from '@/modules/common/components/HCframe'
import {  OrderItem } from '@/modules/outsite/types/outsite'
const styles = require('@/modules/outsite/styles/list')
const data: any = []
for (let i = 0; i < 25; i++) {
  data.push({
    id: i,
    workNo: `刻章 ${i}`,
    customerName: `税务 ${i}`,
    createTime: `2018/09/18`,
    orderNo: `启用 ${i}`,
    managerName:`张三 ${i}`
  })
}
class Main extends React.Component<any, any> {
  public columns = [{
    title: '子任务名称',
    dataIndex: 'workNo'
  }, {
    title: '任务分类',
    dataIndex: 'customerName'
  }, {
    title: '操作时间',
    dataIndex: 'createTime'
  }, {
    title: '状态',
    dataIndex: 'orderNo'
  }, {
    title: '最后操作',
    dataIndex: 'managerName'
  }, {
    title: '操作',
    dataIndex: 'take',
    render: (k: any, item: OrderItem) => {
      return (
        <span>
          <span className={`likebtn`} onClick={() => { this.onShow.bind(this)(item) }}>查看</span>
          <span className={`likebtn`} onClick={() => { this.onBegin.bind(this)(item) }}>启用</span>
        </span>
      )
    }
  }]
  constructor (props: any) {
    super(props)
    const value = props.value || {}
    this.state = {
      selectedRowKeys: []
    }
  }

  public render () {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
          this.setState({
            // selectedRowKeys: [...Array(46).keys()] // 0...45
          })
        }
      }, {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys: any) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((key: any, index: any) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          this.setState({ selectedRowKeys: newSelectedRowKeys })
        }
      }, {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys: any) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((key: any, index: any) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          this.setState({ selectedRowKeys: newSelectedRowKeys })
        }
      }]
      // onSelection: this.onSelection
    }
    return (
      <div className={styles.container}>
      <HCframe title='其他任务配置'>
        <Row>
          <Col span={20}>
            <SearchForm onChange={this.onChange.bind(this)} />
          </Col>
          <Col span={4} style={{textAlign: 'right'}}>
            <span className={styles.acts}>
              <Button type='primary'  onClick={this.searchBtn.bind(this)}>搜索</Button>
              <Button type='primary'  onClick={this.addtBtn.bind(this)}>新增</Button>
            </span>
          </Col>
        </Row>
        <Row>
        <Table  columns={this.columns} dataSource={data} />
        </Row>
      </HCframe>
    </div>
    )
  }
  // 表单改变
  public onChange (formData: any) {
    console.log('表单改变', formData)
  }

  // 导出
  public addtBtn () {
    console.log('点击新增')
    // service.delList(selectedRowKeys)
  }

  // 搜索
  public searchBtn () {
    const { selectedRowKeys } = this.state
    console.log('set readed list::', selectedRowKeys)
    // service.setReadedList(selectedRowKeys)
  }

  // 查看
  public onShow (item: OrderItem) {
    console.log('点击查看')
  }
  // 启用
  public onBegin (item: OrderItem) {
    console.log('点击启用禁用')
  }
  // 选择的数组
  public onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  // 分页
  public pageChange = (selectedRowKeys: any) => {
    console.log('pageChange changed: ', selectedRowKeys)
  }
}
export default Main
