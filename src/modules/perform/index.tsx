import React from 'react'
import { Table, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import ContentBox from '@/modules/common/content'
// import { fetchListAction } from './action'
// import { connect } from 'react-redux'
import { update, fetchList } from './api'
// type PerfromItem = Perform.ItemProps
interface States {
  dataSource: Perform.ItemProps[]
  pagination: {
    total: number
    current: number
    pageSize: number
  }
}
class Main extends React.Component<Perform.Props> {
  public params: Perform.SearchPayload = {
    pageCurrent: 1,
    pageSize: 15,
    templateName: ''
  }
  public state: States = {
    dataSource: [],
    pagination: {
      total: 0,
      current: this.params.pageCurrent,
      pageSize: this.params.pageSize
    }
  }
  public pageSizeOptions = ['15', '30', '50', '80', '100', '200']
  public columns: ColumnProps<Perform.ItemProps>[] = [{
    title: '任务名称',
    dataIndex: 'name'
  }, {
    title: '任务价格',
    dataIndex: 'productPrice',
    width: 120
  }, {
    title: '绩效额度',
    dataIndex: 'reward',
    width: 120,
    onCell: (record) => {
      return {
        style: {
          cursor: 'pointer'
        },
        onClick: () => {
          if (record.disabled === false) {
            return
          }
          const dataSource = this.state.dataSource
          record.disabled = !(record.disabled !== undefined ? record.disabled : true)
          const index = dataSource.findIndex((item) => {
            if (item.id === record.id) {
              return true
            }
          })
          if (index > -1) {
            dataSource[index] = record
          }
          console.log(dataSource, index, 'onClick')
          this.setState({
            dataSource
          })
        }
      }
    },
    render: (text, record, index) => {
      const disabled = record.disabled !== undefined ? record.disabled : true
      const dataSource = this.state.dataSource
      return (
        disabled ? (
          <span>{text}</span>
        )
        : (
          <Input
            value={text}
            onChange={(e) => {
              dataSource[index].reward = e.target.value
              this.setState({
                dataSource
              })
            }}
          />
        )
      )
    }
  }, {
    title: '操作',
    width: 60,
    align: 'center',
    render: (text, record, index) => {
      const disabled = record.disabled !== undefined ? record.disabled : true
      const dataSource = this.state.dataSource
      return (
        <span>
          <span
            className='href'
            onClick={() => {
              dataSource[index].disabled = !disabled
              // const disabled = record.disabled !== undefined ? record.disabled : true
              // const dataSource = this.state.dataSource
              // const disabled = dataSource[index].disabled !== undefined ? dataSource[index].disabled : true
              // dataSource[index].disabled = !disabled
              this.setState({
                dataSource
              })
              if (!disabled) {
                update({
                  id: record.id,
                  reward: record.reward
                })
              }
            }}
          >
          {disabled ? '编辑' : '保存'}
          </span>
        </span>
      )
    }
  }]
  public componentWillMount () {
    this.fetchList()
  }
  public handlePageChange (page: number) {
    const { pagination } = this.state
    pagination.current = page
    this.params.pageCurrent = page
    this.setState({
      pagination
    }, () => {
      this.fetchList()
    })
  }
  public onShowSizeChange (current: number, size: number) {
    const { pagination } = this.state
    pagination.current = current
    pagination.pageSize = size
    this.params.pageCurrent = current
    this.params.pageSize = size
    this.setState({
      pagination
    }, () => {
      this.fetchList()
    })
  }
  public fetchList () {
    const { pagination } = this.state
    return fetchList(this.params).then((res) => {
      pagination.total = res.total
      pagination.pageSize = res.size
      pagination.current = res.current
      this.setState({
        pagination,
        dataSource: res.records
      })
      return res
    })
  }
  public render () {
    const pagintaion = this.state.pagination
    return (
      <ContentBox
        title='绩效配置'
      >
        <div>
          <Input.Search
            placeholder='请输入任务名称'
            onSearch={(value) => {
              this.params.templateName = value
              this.fetchList()
            }}
            style={{width: 200, marginBottom: '25px'}}
          />
          <Table
            columns={this.columns}
            dataSource={this.state.dataSource}
            size='middle'
            bordered
            pagination={{
              onChange: this.handlePageChange.bind(this),
              onShowSizeChange: this.onShowSizeChange.bind(this),
              total: pagintaion.total,
              current: pagintaion.current,
              pageSize: pagintaion.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: this.pageSizeOptions,
              showTotal (total) {
                return `共计 ${total} 条`
              }
            }}
          />
        </div>
      </ContentBox>
    )
  }
}
export default Main
