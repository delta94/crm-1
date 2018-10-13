import React from 'react'
import { Table, Button, Tooltip } from 'antd'
import moment from 'moment'
import { ColumnProps } from 'antd/lib/table'
import Modal from 'pilipa/libs/modal'
import Condition, { ConditionOptionProps } from '@/modules/common/search/Condition'
import ContentBox from '@/modules/common/content'
import SearchName from '@/modules/common/search/SearchName'
import AddButton from '@/modules/common/content/AddButton'
import Provider from '@/components/Provider'
import Allot from '@/modules/customer/allot'
import AllotResult from './AllotResult'
import Detail from './detail'
import { fetchList, fetchCityCount, deleteCustomer, allocateAuto } from './api'
import BaseInfo from '@/modules/customer/BaseInfo'
import Import from '@/modules/customer/import'
import { connect } from 'react-redux'
type DetailProps = Customer.DetailProps
interface States {
  dataSource: DetailProps[]
  selectedRowKeys: string[]
  pagination: {
    total: number
    current: number
    pageSize: number
  }
  cityList: any[]
  data: ConditionOptionProps[]
}
interface ParamsProps {
  cityCode?: string
  pageSize?: number
  pageCurrent?: number
  storageBeginDate?: string
  storageEndDate?: string
  createBeginDate?: string
  createEndDate?: string
  customerName?: string
  contactPerson?: string
  contactPhone?: string
  customerSource?: string
  /** 纳税类型 */
  payTaxesNature?: string
  [field: string]: any
}
const all = [{
  label: '全部',
  value: ''
}]
const data: ConditionOptionProps[] = [
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
        value: '1'
      },
      {
        label: '7天',
        value: '7'
      },
      {
        label: '30天',
        value: '30'
      }
    ],
    type: 'date'
  },
  {
    label: ['所属城市'],
    value: '',
    field: 'cityCode',
    type: 'select',
    options: [
      {
        label: '',
        value: ''
      }
    ]
  },
  {
    label: ['纳税类别'],
    value: '',
    field: 'payTaxesNature',
    type: 'select',
    options: all.concat(APP.keys.EnumPayTaxesNature)
  },
  {
    label: ['客户来源'],
    value: '',
    field: 'customerSource',
    type: 'select',
    options: all.concat(APP.keys.EnumCustomerSource)
  }
]
class Main extends React.Component<Customer.Props, States> {
  public state: States = {
    dataSource: [],
    selectedRowKeys: [],
    cityList: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 15
    },
    data
  }
  public pageSizeOptions = ['15', '30', '50', '80', '100', '200']
  public params: ParamsProps = {}
  public columns: ColumnProps<DetailProps>[] = [{
    title: '客户名称',
    dataIndex: 'customerName',
    render: (val, record) => {
      return (
        <span className='href' onClick={this.show.bind(this, record.customerId)}>{val}</span>
      )
    }
  }, {
    title: '联系人',
    dataIndex: 'contactPerson'
  }, {
    title: '联系电话',
    dataIndex: 'contactPhone'
  }, {
    title: (
      <span>
        空置天数
        <Tooltip placement='top' title='客户未被跟进的天数'>
          <i className='fa fa-exclamation-circle ml5'></i>
        </Tooltip>
      </span>
    ),
    dataIndex: 'vacantDays'
  }, {
    title: '城市',
    dataIndex: 'cityName'
  }, {
    title: '客户来源',
    dataIndex: 'customerSource',
    render: (val) => {
      return (APP.dictionary[`EnumCustomerSource-${val}`])
    }
  }, {
    title: '创建时间',
    dataIndex: 'enterStorageTime'
  }, {
    title: (
      <span>
        入库时间
        <Tooltip placement='top' title='客户进入客资池的时间'>
          <i className='fa fa-exclamation-circle ml5'></i>
        </Tooltip>
      </span>
    ),
    dataIndex: 'enterStorageTime'
  }]
  public componentWillMount () {
    this.fetchList()
    fetchCityCount().then((res) => {
      const cityList: Array<{cityCode: string, cityName: string, rows: number}> = res.data
      const options: Array<{label: string, value: string}> = []
      cityList.forEach((item) => {
        options.push({
          label: `${item.cityName}(${item.rows})`,
          value: item.cityCode
        })
      })
      data[1].options = options
      this.setState({
        data
      })
    })
  }
  public fetchList () {
    const pagination = this.state.pagination
    this.params.pageSize = pagination.pageSize
    this.params.pageCurrent = pagination.current
    fetchList(this.params).then((res) => {
      pagination.total = res.pageTotal
      this.setState({
        pagination,
        dataSource: res.data
      })
    })
  }
  public onSelectAllChange (selectedRowKeys: string[]) {
    // console.log(selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  public handleSearch (values: any) {
    console.log(values, 'values')
    this.params.storageBeginDate = undefined
    this.params.storageEndDate = undefined
    this.params.createBeginDate = undefined
    this.params.createEndDate = undefined
    if (values.date.label === '入库时间') {
      let storageBeginDate
      let storageEndDate
      if (values.date.value === 'all') {
        storageBeginDate = undefined
        storageEndDate = undefined
      } else if (values.date.value.indexOf('至') > -1) {
        storageBeginDate = values.date.value.split('至')[0]
        storageEndDate = values.date.value.split('至')[1]
      } else {
        storageBeginDate = moment().startOf('day').subtract(values.date.value - 1, 'day').format('YYYY-MM-DD')
        storageEndDate = moment().format('YYYY-MM-DD')
      }
      this.params.storageBeginDate = storageBeginDate
      this.params.storageEndDate = storageEndDate
    } else if (values.date.label === '创建时间') {
      let createBeginDate
      let createEndDate
      if (values.date.value === 'all') {
        createBeginDate = undefined
        createEndDate = undefined
      } else if (values.date.value.indexOf('至') > -1) {
        createBeginDate = values.date.split('至')[0]
        createEndDate = values.date.split('至')[1]
      } else {
        createBeginDate = moment().startOf('day').subtract(values.date - 1, 'day').format('YYYY-MM-DD')
        createEndDate = moment().format('YYYY-MM-DD')
      }
      this.params.createBeginDate = createBeginDate
      this.params.createEndDate = createEndDate
    }
    this.params.cityCode = values.cityCode.value || undefined
    this.params.payTaxesNature = values.payTaxesNature.value || undefined
    this.params.customerSource = values.customerSource.value || undefined
    this.fetchList()
  }
  public handleSearchType (value: {value?: string, key: string}) {
    this.params.customerName = undefined
    this.params.contactPerson = undefined
    this.params.contactPhone = undefined
    this.params.customerSource = undefined
    this.params.payTaxesNature = undefined
    this.params[value.key] = value.value
    this.fetchList()
  }
  public add () {
    let ins: any
    const modal = new Modal({
      content: (
        <Provider>
          <BaseInfo
            reset
            ref={(ref: any) => { ins = ref.getWrappedInstance() }}
            onClose={() => {modal.hide()}}
          />
        </Provider>
      ),
      footer: (
        <div className='text-right mt10'>
          <Button
            className='mr5'
            type='primary'
            onClick={() => {
              console.log(ins.refs.wrappedComponent)
              ins.refs.wrappedComponent.save().then(() => {
                APP.success('保存成功')
                modal.hide()
                this.fetchList()
              }, () => {
                APP.error('保存失败')
              })
            }}
          >
            保存
          </Button>
        </div>
      ),
      title: '录入客资',
      mask: true,
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public import () {
    const modal = new Modal({
      style: 'width: 800px',
      content: (
        <Provider><Import /></Provider>
      ),
      footer: null,
      title: '导入',
      mask: true,
      onOk: () => {
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public show (customerId: string) {
    let instance: any
    const modal = new Modal({
      content: (
        <Provider>
          <Detail
            getWrappedInstance={(ins) => {
              instance = ins
            }}
            customerId={customerId}
            footer={(
              <div className='text-right mt10'>
                <Button
                  type='primary'
                  className='mr5'
                  onClick={() => {
                    instance.save().then(() => {
                      APP.success('保存成功')
                      this.fetchList()
                    }, () => {
                      APP.error('保存失败')
                    })
                  }}
                >
                  保存
                </Button>
                <Button
                  type='ghost'
                  onClick={() => {
                    deleteCustomer(customerId).then(() => {
                      modal.hide()
                      this.fetchList()
                    })
                  }}
                >
                  删除
                </Button>
              </div>
            )}
          />
        </Provider>
      ),
      footer: null,
      header: null,
      mask: true,
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public showResult () {
    const modal = new Modal({
      content: (
        <Provider>
          <AllotResult
            onCancel={() => {modal.hide()}}
            deleteCus={() => {
              const result = this.props.assignResult.repeatCustomers
              const ids: string[] = []
              result.map((item) => {
                ids.push(item.id)
              })
              const payload = ids.join(',')
              deleteCustomer(payload).then(() => {
                APP.success('操作成功')
                modal.hide()
              })
            }}
          />
        </Provider>
      ),
      footer: null,
      title: '执行结果',
      mask: true,
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  // public SelectAll () {
  //   const ids: string[] = []
  //   this.state.dataSource.forEach((item) => {
  //     ids.push(item.customerId)
  //   })
  //   // console.log(ids, 'ids')
  //   this.setState({
  //     selectedRowKeys: ids,
  //     selectAll: true
  //   })
  // }
  public deleteCustomer () {

  }
  public toOrganizationAuto () {
    if (!this.state.selectedRowKeys.length) {
      APP.error('请选择需要分配客户')
      return
    }
    const modal = new Modal({
      content: (
        <div>你确定要应用自动分配吗？</div>
      ),
      title: '自动分配客资',
      mask: true,
      onOk: () => {
        // console.log(this.state.selectedRowKeys, 'this.state.selectedRowKeys')
        const customers: Array<{
          id: string
          cityCode: string
          customerName: string
          customerSource: string
        }> = []
        this.state.selectedRowKeys.map((item) => {
          this.state.dataSource.map((item1) => {
            if (item === item1.customerId) {
              customers.push({
                id: item1.customerId,
                cityCode: item1.cityCode,
                customerName: item1.customerName,
                customerSource: item1.customerSource
              })
            }
          })
        })
        // console.log(customers, 'customers')
        allocateAuto(customers).then((res) => {
          APP.dispatch({
            type: 'change customer data',
            payload: {
              assignResult: res.data
            }
          })
          this.showResult()
          modal.hide()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public toOrganizationByHand () {
    if (!this.state.selectedRowKeys.length) {
      APP.error('请选择需要分配客户')
      return
    }
    const modal = new Modal({
      content: (
        <Provider>
          <Allot
            onClose={() => {
              this.fetchList()
              modal.hide()
            }}
            selectedRowKeys={this.state.selectedRowKeys}
            params={this.params}
            pagetotal={this.state.pagination.total}
          />
        </Provider>
      ),
      title: '分配客资',
      footer: null,
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
  public handlePageChange (page: number) {
    const { pagination } = this.state
    pagination.current = page
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
    this.setState({
      pagination
    }, () => {
      this.fetchList()
    })
  }
  public render () {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectAllChange.bind(this)
    }
    const { pagination } = this.state
    return (
      <ContentBox
        title='我的客资'
        rightCotent={(
          <div>
            <AddButton
              style={{marginRight: '10px'}}
              title='新增'
              onClick={() => {
                this.add()
              }}
            />
            <AddButton
              title='导入'
              onClick={() => {
                this.import()
              }}
            />
          </div>
        )}
      >
        <div className='mb10 clear'>
          <div className='fl' style={{ width: 740 }}>
            <Condition
              dataSource={this.state.data}
              onChange={this.handleSearch.bind(this)}
            />
          </div>
          <div className='fr' style={{ width: 290 }}>
            <SearchName
              style={{paddingTop: '5px'}}
              options={[
                { value: 'customerName', label: '客户名称'},
                { value: 'contactPerson', label: '联系人'},
                { value: 'contactPhone', label: '联系电话'}
                // { value: 'customerSource', label: '客户来源'},
                // { value: 'payTaxesNature', label: '纳税类别'}
              ]}
              placeholder={''}
              // onChange={this.handleSearchType.bind(this)}
              onKeyDown={(e, val) => {
                if (e.keyCode === 13) {
                  this.handleSearchType(val)
                }
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
          pagination={{
            onChange: this.handlePageChange.bind(this),
            onShowSizeChange: this.onShowSizeChange.bind(this),
            total: pagination.total,
            current: pagination.current,
            pageSize: pagination.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: this.pageSizeOptions,
            showTotal (total) {
              return `共计 ${total} 条`
            }
          }}
        />
        <div className='btn-position'>
          {/* <Button type='primary' onClick={this.SelectAll.bind(this)} className='mr5'>全选</Button> */}
          <Button type='primary' className='mr5' onClick={this.toOrganizationByHand.bind(this)}>手工分配</Button>
          <Button type='primary' className='mr5' onClick={this.toOrganizationAuto.bind(this)}>应用自动分配</Button>
        </div>
      </ContentBox>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
})(Main)
