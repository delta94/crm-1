import React from 'react'
import { Table, Divider, Input, Modal as M, Select } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { fetchDirectList, changeCompanyInfo, fetchCompanyDetail, delDirect } from '../api'
import { Modal } from 'pilipa'
import Detail from './detail'
import Area from './Area'
const Search = Input.Search
interface Props {
  type?: 'DirectCompany' | 'Agent'
  columns?: ColumnProps<any>[]
}
interface State {
  pagination?: Common.PaginationProps
  dataSource?: Organ.DirectItemProps[]
}
class Main extends React.Component<Props, State> {
  public type = this.props.type !== undefined ? this.props.type : 'DirectCompany'
  public state: State = {
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 15
    }
  }
  public payload: Organ.DirectSearchPayload = {
    companyType: this.type,
    pageCurrent: 1,
    pageSize: 15
  }
  public columns: ColumnProps<Organ.DirectItemProps>[] = [
    {
      title: '直营',
      dataIndex: 'name'
    },
    {
      title: '区域',
      render: (text, record) => {
        return (
          <span>{record.regionProvinceName}-{record.regionCityName}</span>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href'
              onClick={() => {
                this.show('view', record)
              }}
            >
              查看
            </span>
            <Divider type='vertical' />
            <span
              className='href'
              onClick={() => {
                this.show('update', record)
              }}
            >
              修改
            </span>
            <Divider type='vertical' />
            <span
              className='href'
              onClick={() => {this.delDirect(record.id)}}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public componentWillMount () {
    this.fetchList()
  }
  public fetchList () {
    this.payload.name = this.payload.name || undefined
    fetchDirectList(this.payload).then((res) => {
      this.setState({
        dataSource: res.records,
        pagination: {
          total: res.pageTotal,
          current: res.pageCurrent,
          pageSize: res.pageSize
        }
      })
    })
  }
  public show (type: 'view' | 'update', record: Organ.DirectItemProps) {
    if (record) {
      fetchCompanyDetail({id: record.id}).then((res) => {
        const modal = new Modal({
          title: '新增',
          content: (
            <Detail
              disabled={type === 'view'}
              item={res}
              onOk={(values) => {
                if (type === 'update') {
                  changeCompanyInfo(values).then(() => {
                    this.fetchList()
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
      })
    }
  }
  // 确认删除
  public delDirect = (id: number) => {
    M.confirm({
      title: '删除机构',
      content: '确定删除机构吗？',
      onOk: () => {
        delDirect(id)
          .then(() => {
            APP.success('操作成功')
            this.fetchList()
          })
      }
    })
  }
  public render () {
    const { dataSource, pagination } = this.state
    return (
      <div>
        <div className='mb10'>
          <Search
            className='inline-block middle mr5'
            placeholder={`请输入${this.type === 'Agent' ? '代理商' : '直营'}名称`}
            onSearch={(value) => {
              this.payload.pageCurrent = 1
              this.payload.name = value
              this.fetchList()
            }}
            style={{ width: 200 }}
          />
          <Area
            style={{
              verticalAlign: 'middle'
            }}
            onChange={(value) => {
              if (value.length === 2) {
                this.payload.pageCurrent = 1
                this.payload.regionCity = value[1].code
                this.fetchList()
              }
              if (value.length === 0) {
                this.payload.regionCity = undefined
                this.fetchList()
              }
            }}
          />
          {/* {
            this.props.type === 'Agent' && (
              <Select
                className='ml5'
                style={{width: 120}}
                onChange={(value: any) => {
                  this.payload.companyStatus = value
                  this.fetchList()
                }}
              >
                {
                  APP.keys.EnumOrganAgentSource.map((item) => {
                    return (
                      <Select.Option key={item.value}>
                        {item.label}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            )
          } */}
        </div>
        <div>
          <Table
            bordered
            columns={this.props.columns || this.columns}
            dataSource={dataSource}
            pagination={{
              total: pagination.total,
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange: (current) => {
                pagination.current = current
                this.payload.pageCurrent = current
                this.fetchList()
                this.setState({
                  pagination
                })
              },
              showTotal (total) {
                return `共计 ${total} 条`
              }
            }}
          />
        </div>
      </div>
    )
  }
}
export default Main
