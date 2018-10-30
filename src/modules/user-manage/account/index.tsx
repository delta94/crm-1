import {
  Button , Divider, Input, Table, Modal as M, Select
} from 'antd'
import { Modal } from 'pilipa'
import React from 'react'
import Detail from './detail'
import { connect } from 'react-redux'
import { ColumnProps } from 'antd/lib/table'
import { fetchAccountListAction } from '../action'
import { updateAccount, deleteAccount, batchAssignAccount } from '../api'
import Assign from './Assign'
const styles = require('../style')
interface States {
  selectedRowKeys: number[]
}
interface Props extends UserManage.Props {
  type: UserManage.TypeProps
}
class Main extends React.Component<Props> {
  public searchPayload: UserManage.AccoutSearchPayload = {
    pageCurrent: 1,
    pageSize: 15,
    userType: this.props.type
  }
  public state: States = {
    selectedRowKeys: []
  }
  public selectedRow: UserManage.AccountItemProps[] = []
  public loaded = false
  public columns: ColumnProps<UserManage.AccountItemProps>[] = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '手机号',
      dataIndex: 'phone'
    },
    {
      title: '代理商',
      dataIndex: 'companyName'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '部门',
      dataIndex: 'organizationName'
    },
    {
      title: '操作',
      dataIndex: 'oprate',
      render: (text, record) => {
        return (
          <div>
            <span
              hidden={!APP.hasPermission('bizbase_user_agent_user_query') || !APP.hasPermission('bizbase_user_direct_user_query')}
              className='href'
              onClick={() => {this.update('view', record)}}
            >
              查看
            </span>
            <Divider type='vertical'/>
            <span
              hidden={!APP.hasPermission('bizbase_user_agent_user_edit') || !APP.hasPermission('bizbase_user_direct_user_edit')}
              className='href'
              onClick={() => {this.update('update', record)}}
            >
              修改
            </span>
            <Divider type='vertical' />
            <span
              hidden={!APP.hasPermission('bizbase_user_agent_user_delete') || !APP.hasPermission('bizbase_user_direct_user_delete')}
              className='href'
              onClick={() => this.delete([record.id])}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public componentWillMount () {
    if (this.props.companyCode) {
      console.log(this.props.companyCode, 'companyCode')
      this.searchPayload.companyId = this.props.companyCode
      this.searchPayload.companyName = this.props.companyName
      this.searchPayload.userType = this.props.type
      this.fetchData()
    }
    APP.dispatch<UserManage.Props>({
      type: 'change user manage data',
      payload: {
        account: {
          dataSource: [],
          searchPayload: this.searchPayload
        }
      }
    })
  }
  public componentWillReceiveProps (props: Props) {
    if (props.onlyOne && props.account.dataSource.length === 0 && props.type && props.companyCode !== undefined && this.loaded === false) {
      this.searchPayload.companyId = props.companyCode
      this.searchPayload.companyName = props.companyName
      this.searchPayload.userType = props.type
      this.fetchData()
    }
  }
  public fetchData () {
    this.loaded = true
    APP.dispatch<UserManage.Props>({
      type: 'change user manage data',
      payload: {
        companyCode: this.searchPayload.companyId,
        companyName: this.searchPayload.companyName,
        account: {
          searchPayload: this.searchPayload
        }
      }
    })
    fetchAccountListAction(this.searchPayload)
  }
  public onSelectChange = (selectedRowKeys: number[], selectedRow: UserManage.AccountItemProps[]) => {
    this.selectedRow = selectedRow
    this.setState({ selectedRowKeys })
  }
  // 确认删除
  public delete = (ids: any[] = this.state.selectedRowKeys) => {
    M.confirm({
      title: '删除账号',
      content: '确定删除账号吗？',
      onOk: () => {
        deleteAccount(ids).then(() => {
          this.fetchData()
        })
      }
    })
  }
  // 批量添加
  public assignment () {
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      APP.error('请选择账号')
      return
    }
    let organizationId: number
    let error = false
    this.selectedRow.map((item) => {
      if (organizationId !== undefined && organizationId !== item.organizationId) {
        error = true
      }
      organizationId = item.organizationId
    })
    if (error) {
      APP.error('请选择同部门账号')
      return
    }
    const modal = new Modal({
      title: '批量分配',
      content: (
        <Assign
          organizationId={organizationId}
          userIds={selectedRowKeys}
          onOk={(id) => {
            batchAssignAccount({
              parentId: id,
              userIds: selectedRowKeys
            }).then(() => {
              APP.success('批量分配成功')
              modal.hide()
              this.fetchData()
            })
          }}
          onCancel={() => {
            modal.hide()
          }}
        />
      ),
      footer: null
    })
    modal.show()
  }
  // 设置错误信息
  public getErrorInfo: any = (verification: 'empty' | 'same' | 'normal') => {
    let errorInfo
    if (verification === 'empty') {
      errorInfo = {help: '请输入部门名称', validateStatus: 'error'}
    } else if (verification === 'same') {
      errorInfo = {help: '部门名称重复', validateStatus: 'error'}
    } else if (verification === 'normal') {
      errorInfo = {help: ''}
    }
    return errorInfo
  }

  // 查看、修改、添加账号
  public update = (type: 'view' | 'update', item?: UserManage.AccountItemProps) => {
    item.companyName = this.props.companyName
    let title = '查看账号'
    if (type === 'update') {
      title = '修改账号'
    }
    const modal = new Modal({
      title: `${title}`,
      content: (
        <Detail
          companyCode={this.props.companyCode}
          type={this.props.type}
          item={item}
          disabled={type === 'view'}
          onOk={(values) => {
            values.companyId = this.props.companyCode
            if (type === 'update') {
              updateAccount(values).then(() => {
                this.fetchData()
              })
            }
            modal.hide()
          }}
          onCancel={() => {
            modal.hide()
          }}
        />
      ),
      footer: null
    })
    modal.show()
  }
  public render () {
    const { dataSource } = this.props.account
    const { selectedRowKeys } = this.state
    const { companyList, onlyOne, companyCode } = this.props
    const disabled = onlyOne
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const selectValue: any = companyCode !== undefined ? {key: String(companyCode)} : undefined
    return (
      <div>
        <div className={styles.formitem}>
          <Select
            showSearch
            value={selectValue}
            disabled={disabled}
            placeholder='请输入公司名称'
            className={styles.searchcondition}
            showArrow={false}
            labelInValue
            onSelect={(value: {key: string, label: any}) => {
              this.searchPayload.companyId = value.key
              this.searchPayload.companyName = value.label
              this.fetchData()
            }}
          >
            {
              companyList.map((item) => {
                return (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                )
              })
            }
          </Select>
          <Input
            placeholder='请输入姓名'
            className={styles.searchcondition}
            onChange={(e) => {
              this.searchPayload.name = e.target.value
            }}
          />
          <Input
            placeholder='请输入手机号'
            className={styles.searchcondition}
            onChange={(e) => {
              this.searchPayload.phone = e.target.value
            }}
          />
          <Input
            placeholder='请输入部门名称'
            className={styles.searchcondition}
            onChange={(e) => {
              this.searchPayload.organizationName = e.target.value
            }}
          />
          <Button type='primary' onClick={() => {this.fetchData()}}>查询</Button>
        </div>
        <div>
          <Table
            rowKey='id'
            bordered
            columns={this.columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pagination={{
              showQuickJumper: true,
              showTotal (total) {
                return `共计 ${total} 条`
              }
            }}
          />
        </div>
        {
          dataSource.length === 0
          || <Button
            type='primary'
            className={styles.assignBtn}
            onClick={() => this.assignment()}
          >
            批量分配
          </Button>
        }
        {
          dataSource.length === 0
          || <Button
            type='primary'
            disabled={!this.state.selectedRowKeys.length}
            className={styles.delBtn}
            onClick={this.delete.bind(this, undefined)}
          >
            批量删除
          </Button>
        }
      </div>
    )
  }
}

export default connect((state: Reducer.State) => {
  return state.userManage
})(Main)
