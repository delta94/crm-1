import React from 'react'
import { Table, DatePicker, Form, Select, Button, Row, Col } from 'antd'
import moment from 'moment'
import SearchForm from '../components/SearchForm'
import HCframe from '@/modules/common/components/HCframe'
import {  OrderItem } from '../types/workorder'
import Service from '@/modules/workorder/api'

const styles = require('../styles/list.styl')
const showPath = '/workorder/show'
const data: any = []
for (let i = 0; i < 25; i++) {
  data.push({
    id: i,
    workNo: `C ${i}`,
    customerName: `北京爱康鼎科技有限公司 ${i}`,
    createTime: `2018/09/18`,
    orderNo: `${i}`,
    name: `代理记账`,
    status: `准备材料(外勤)`,
    managerName:`张三 ${i}`
  })
}

class Main extends React.Component<any, any> {
  public columns = [{
    title: '工单编号',
    dataIndex: 'workNo'
  }, {
    title: '企业名称',
    dataIndex: 'customerName'
  }, {
    title: '创建日期',
    dataIndex: 'createTime'
  }, {
    title: '提单人',
    dataIndex: 'managerName'
  }, {
    title: '对应订单',
    dataIndex: 'orderNo'
  }, {
    title: '服务内容',
    dataIndex: 'name'
  }, {
    title: '当前状态',
    dataIndex: 'status'
  }, {
    title: '操作',
    dataIndex: 'take',
    render: (k: any, item: OrderItem) => {
      return (
        <span>
          <span className={`likebtn`} onClick={() => { this.onShow.bind(this)(item) }}>查看</span>
        </span>
      )
    }
  }]
  constructor (props: any) {
    super(props)
    const value = props.value || {}
    this.state = {
      selectedRowKeys: [],
      dataSource:[],
      pageConf: {
        currentPage: 1,
        total: 1
      },
      searchStr:'',  // 搜索条件
      chooseSever:'', // 选择的服务内容
      chooseState:'', // 选择的状态
      chooseBeginDate:'', // 开始时间
      chooseEndDate:''   // 结束时间
    }
  }
  public componentWillMount () {
    this.getList()
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
      <HCframe title='我的工单'>
        <Row>
          <Col span={20}>
            <SearchForm onChange={this.onChange.bind(this)} />
          </Col>
          <Col span={4} style={{textAlign: 'right'}}>
            <span className={styles.acts}>
              <Button  onClick={this.exportBtn.bind(this)}>导出</Button>
            </span>
          </Col>
        </Row>
        <Row>
        <Table
          rowSelection={rowSelection}
          onChange={this.pageChange}
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={this.state.pageConf}
        />
        </Row>
      </HCframe>
    </div>
    )
  }
  // 表单改变
  public onChange (formData: any) {
    console.log('表单改变', formData)
    console.log(formData.text, formData.currency, formData.orderState, JSON.stringify(formData.dateArr[0]) , JSON.stringify(formData.dateArr[1].substring(0, 9)))
    this.setState({
      searchStr: formData.text,  // 搜索条件
      chooseSever: formData.currency, // 选择的服务内容
      chooseState: formData.orderState, // 选择的状态
      chooseBeginDate: formData.dateArr[0].format('YYYY-MM-DD'), // 开始时间
      chooseEndDate: formData.dateArr[1].format('YYYY-MM-DD')  // 结束时间
    })
  }

  // 导出
  public exportBtn () {
    console.log('点击导出')
    // service.delList(selectedRowKeys)
  }
  // 查看
  public onShow (item: OrderItem) {
    APP.history.push(`${showPath}/${item.id}`)
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
  // 获取列表数据
  public getList () {
    Service.getWorkOrderList().then((res: any) => {
      const { pageSize, pageTotal, pageCurrent } = res
      this.setState({
        dataSource: res.records,
        pageConf: {
          pageSize,
          pageTotal,
          pageCurrent
        }
      })
    }, () => {

    })
  }
}
export default Main
