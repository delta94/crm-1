import React from 'react'
import { Divider, Modal, Table } from 'antd'
import Service from '@/modules/outsite/services'
import '@/modules/common/styles/base.styl'
import _ from 'lodash'
import { ColumnProps } from 'antd/lib/table'
type TaskItem = OutSide.TaskItem
const showPath = '/outsite/tasktpl/form'

/*路径未修改，跳转编辑系统任务  subform组件中*/
interface States {
  selectedRowKeys: string[]
  modalVisible: boolean,
  searchData: any,
  item: TaskItem,
  dataSource: TaskItem[],
  pageConf: {
    total: number,
    size: number,
    current: number
  }
}

function onShowSizeChange (current: any, pageSize: any) {
  console.log(current, pageSize)
}

class Main extends React.Component<any, any> {
  public item: TaskItem = {}
  public state: States = {
    selectedRowKeys: [],
    modalVisible: false,
    item: {},
    pageConf: {
      total: 0,
      size: 15,
      current: 1
    },
    searchData: {
      systemFlag: 1,
      pageCurrent: 1,
      pageSize: 15
    },
    dataSource: []
  }
  public pageSizeOptions = ['15', '30', '50', '80', '100', '200']
  public columns: ColumnProps<TaskItem>[] = [{
    title: '主任务',
    dataIndex: 'name'
  }, {
    title: '子任务',
    dataIndex: 'subList',
    render: (k, item) => {
      if (!item || !item.subList) {
        return
      }
      const data = _.map(item.subList, (subitem: any) => {
        return subitem.name
      })
      return data.join(',')
    }
  }, {
    title: '已绑定商品名',
    dataIndex: 'productName'
  }, {
    title: '是否优先',
    dataIndex: 'priority',
    render: (k, item) => {
      return <span>{item.priority === 'OPEN' ? '是' : '否'}</span>
    }
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
    align: 'center',
    render: (k: any, item) => {
      return (
        <span>
          <span onClick={this.onShow.bind(this, item)} style={{color: '#3B91F7'}} className='likebtn'>编辑</span>
          <Divider type='vertical' style={{color: '#979797'}}/>
          <span onClick={this.showModal.bind(this, item)} style={{color: '#3B91F7'}} className='likebtn'>解除商品关系</span>
        </span>
      )
    }
  }]
  public data = [{
    key: '1',
    id: 1,
    name: '注册公司',
    age: '1、核名 2、网上申请 3、下发执照 4、刻章',
    address: '是',
    operation: '编辑'
  }, {
    key: '2',
    id: 2,
    name: '注册公司',
    age: '1、核名 2、网上申请 3、下发执照 4、刻章',
    address: '否',
    operation: '编辑'
  }, {
    key: '3',
    id: 3,
    name: '注册公司',
    age: '1、核名 2、网上申请 3、下发执照 4、刻章',
    address: '是',
    operation: '编辑'
  }, {
    key: '4',
    id: 4,
    name: '注册公司',
    age: '1、核名 2、网上申请 3、下发执照 4、刻章',
    address: '是',
    operation: '编辑'
  }, {
    key: '5',
    id: 5,
    name: '注册公司',
    age: '1、核名 2、网上申请 3、下发执照 4、刻章',
    address: '是',
    operation: '编辑'
  }]

  public componentWillMount () {
    this.getList()
  }

  // 获取列表数据
  public getList () {
    Service.getTplListByCond(this.state.searchData).then((res: any) => {
      if (!res || !res.records) {
        return
      }
      const { pageConf, searchData } = this.state
      searchData.pageSize = pageConf.size = res.size
      searchData.pageCurrent = pageConf.current = res.current
      pageConf.total = res.total
      this.setState({
        pageConf,
        dataSource: res.records,
        searchData
      })
    })
  }

  public onShow (item: TaskItem) {
    APP.history.push(`${showPath}/${item.id}`)
  }

  // 解除商品绑定关系
  public onUnbind () {
    Service.removeShopRelation(this.item.id, '').then(() => {
      this.hideModal()
      this.getList()
    })
  }

  // 显示确认框
  public showModal (item: any) {
    console.log('show confrim')
    this.setState({
      modalVisible: true
    }, () => {
      this.item = item
    })
  }

  // 隐藏确认框
  public hideModal () {
    this.setState({
      modalVisible: false
    })
  }

  public render () {
    const { pageConf } = this.state
    return (
    <div>
      <Table
        bordered
        columns={this.columns}
        dataSource={this.state.dataSource}
        pagination={{
          total: pageConf.total,
          current: pageConf.current,
          pageSize: pageConf.size,
          onChange: (page: any) => {
            const { searchData } = this.state
            pageConf.current = page
            searchData.pageCurrent = page
            this.setState({
              pageConf,
              searchData
            }, () => {
              this.getList()
            })
          },
          onShowSizeChange: (current: number, size: number) => {
            const { searchData } = this.state
            pageConf.current = current
            pageConf.size = size
            searchData.pageCurrent = current
            searchData.pageSize = size
            this.setState({
              pageConf,
              searchData
            }, () => {
              this.getList()
            })
          },
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: this.pageSizeOptions,
          showTotal (total) {
            return `共计 ${total} 条`
          }
        }}
      />
      <Modal
        title='确认信息'
        visible={this.state.modalVisible}
        onOk={this.onUnbind.bind(this)}
        onCancel={this.hideModal.bind(this)}
        okText='确认'
        cancelText='取消'
      >
        确定删除商品关系？
      </Modal>
    </div>
    )
  }
}

export default Main
