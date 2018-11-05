import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import ContentBox from '@/modules/common/content'
import Condition, { ConditionOptionProps } from '@/modules/common/search/Condition'
import SelectSearch from '@/modules/common/search/SelectSearch'
import SearchName from '@/modules/common/search/SearchName'
import moment from 'moment'
import { fetchListappoint } from '@/modules/business/api'
import _ from 'lodash'
import { showDetail } from '@/modules/business/utils'
import { changeCustomerDetailAction } from '@/modules/customer/action'
type DetailProps = Business.DetailProps
interface States {
  dataSource: DetailProps[]
  pagination: {
    total: number
    current: number
    pageSize: number
  }
}
const all = [{
  label: '全部',
  value: ''
}]
class Main extends React.Component {
  public params: Business.SearchProps = {
    pageSize: 15,
    pageCurrent: 1
  }
  public state: States = {
    dataSource: [],
    pagination: {
      total: 0,
      current: this.params.pageCurrent,
      pageSize: this.params.pageSize
    }
  }
  public paramsleft: Business.SearchProps = {}
  public paramsright: Business.SearchProps = {}
  public data: ConditionOptionProps[] = [
    {
      field: 'date',
      value: '',
      label: ['预约时间', '创建时间', '最后跟进'],
      options: [
        {
          label: '全部',
          value: ''
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
      label: ['意向度'],
      value: '',
      field: 'intention',
      options: all.concat(APP.keys.EnumIntentionality)
    },
    {
      field: 'telephoneStatus',
      value: '',
      label: ['电话状态'],
      options: all.concat(APP.keys.EnumContactStatus)
    }
  ]
  public columns: ColumnProps<DetailProps>[] = [{
    title: '客户名称',
    dataIndex: 'customerName',
    render: (val, record, index) => {
      return (
        <span
          className='href'
          onClick={this.show.bind(this, record, index)}
        >
          {val}
        </span>
      )
    }
  }, {
    title: '联系人',
    dataIndex: 'contactPerson'
  }, {
    title: '意向度',
    dataIndex: 'intention',
    render: (val) => {
      return (APP.dictionary[`EnumIntentionality-${val}`])
    }
  }, {
    title: '空置天数',
    dataIndex: 'freeDays'
  }, {
    title: '当前销售',
    dataIndex: 'currentSalesperson'
  }, {
    title: '客户来源',
    dataIndex: 'source',
    render: (val) => {
      return (APP.dictionary[`EnumCustomerSource-${val}`])
    }
  }, {
    title: '预约时间',
    dataIndex: 'appointmentTime',
    render: (val) => {
      return (moment(val).format('YYYY-MM-DD'))
    }
  }]
  public pageSizeOptions = ['15', '30', '50', '80', '100', '200']
  public componentWillMount () {
    this.fetchList()
  }
  public fetchList () {
    const pagination = this.state.pagination
    return fetchListappoint(this.params).then((res) => {
      pagination.total = res.pageTotal
      pagination.pageSize = res.pageSize
      pagination.current = res.pageCurrent
      this.setState({
        pagination,
        dataSource: res.data
      })
      return res
    })
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
    this.params.pageCurrent = current
    this.params.pageSize = size
    pagination.pageSize = size
    this.setState({
      pagination
    }, () => {
      this.fetchList()
    })
  }
  public handleSearch (values: any) {
    let beginTime
    let endTime
    if (!values.date.value) {
      beginTime = undefined
      endTime = undefined
    } else if (values.date.value.indexOf('至') > -1) {
      beginTime = values.date.value.split('至')[0]
      endTime = values.date.value.split('至')[1]
    } else {
      beginTime = moment().startOf('day').subtract(values.date.value - 1, 'day').format('YYYY-MM-DD')
      endTime = moment().format('YYYY-MM-DD')
    }
    if (values.date.label === '预约时间') {
      this.params.appointStartTime = beginTime
      this.params.appointEndDate = endTime
    } else if (values.date.label === '创建时间') {
      this.params.createBeginDate = beginTime
      this.params.createEndDate = endTime
    } else if (values.date.label === '最后跟进') {
      this.params.lastTrackBeginTime = beginTime
      this.params.lastTrackEndTime = endTime
    }
    this.params.intention = values.intention.value || undefined
    this.params.telephoneStatus = values.telephoneStatus.value || undefined
    this.fetchList()
  }
  public handleSelectType (values: any) {
    this.params.payTaxesNature = values.payTaxesNature || undefined
    this.params.customerSource = values.customerSource || undefined
    this.fetchList()
  }
  public handleSearchType (values: any) {
    this.params.customerName = undefined
    this.params.contactPerson = undefined
    this.params.contactPhone = undefined
    this.params.currentSalesperson = undefined
    this.params.customerSource = undefined
    this.params.payTaxesNature = undefined
    this.params[values.key] = values.value || undefined
    this.fetchList()
  }
  public show (record: DetailProps, index: number) {
    let dataSource: Business.DetailProps[] = []
    const searchPayload = this.params
    let id = record.id
    const modal = showDetail.call(this, record, index, {
      onOk: () => {
        APP.success('操作成功')
        this.fetchList().then((res) => {
          const data = res.data
          if (data instanceof Array && data[index]) {
            id = data[index].id
            changeCustomerDetailAction(id)
          } else {
            modal.hide()
          }
        }, () => {
          modal.hide()
        })
      },
      onPrev: () => {
        index -= 1
        if (index === -1) {
          if (searchPayload.pageCurrent === 1) {
            modal.hide()
            return
          }
          index = searchPayload.pageSize - 1
          searchPayload.pageCurrent -= 1
          dataSource = []
        }
        if (dataSource.length === 0) {
          this.fetchList().then((res) => {
            dataSource = res.data || []
            changeCustomerDetailAction(dataSource[index].id)
          })
        } else {
          changeCustomerDetailAction(dataSource[index].id)
        }
      },
      onNext: () => {
        index += 1
        if (index >= searchPayload.pageSize) {
          searchPayload.pageCurrent += 1
          dataSource = []
          index = 0
        }
        if (dataSource.length === 0) {
          this.fetchList().then((res) => {
            if (res.pageCurrent > Math.round(res.pageTotal / res.pageSize)) {
              searchPayload.pageCurrent -= 1
              modal.hide()
              return
            }
            dataSource = res.data || []
            changeCustomerDetailAction(dataSource[index].id)
          })
        } else {
          if (dataSource[index] === undefined) {
            modal.hide()
            return
          }
          changeCustomerDetailAction(dataSource[index].id)
        }
      }
    })
  }
  public render () {
    const { pagination } = this.state
    return (
      <ContentBox title='我的预约'>
        <div className='mb12'>
          <Condition
            dataSource={this.data}
            onChange={this.handleSearch.bind(this)}
          />
          <div>
            <div style={{display: 'inline-block', width: 290, verticalAlign: 'bottom'}}>
              <SearchName
                style={{paddingTop: '5px'}}
                options={[
                  { value: 'customerName', label: '客户名称'},
                  { value: 'contactPerson', label: '联系人'},
                  // { value: 'contactPhone', label: '联系电话'},
                  { value: 'currentSalesperson', label: '所属销售'}
                ]}
                placeholder={''}
                onKeyDown={(e, val) => {
                  if (e.keyCode === 13) {
                    console.log(val, 'onKeyDown')
                    this.handleSearchType(val)
                  }
                }}
                onSearch={(val) => {
                  this.handleSearchType(val)
                }}
              />
            </div>
            <SelectSearch
              onChange={(values) => {
                console.log(values, 'values')
                this.handleSelectType(values)
              }}
            />
          </div>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.state.dataSource}
          bordered
          rowKey={'id'}
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
      </ContentBox>
    )
  }
}
export default Main
