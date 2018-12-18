import React from 'react'
import moment from 'moment'
import { Select, Row, Col, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFirms, getTrailRank } from '@/modules/stat/api'
import { getSalesByCompany } from '@/modules/common/api'
import Bar from './Bar'
import Pie from './Pie'
import AddButton from '@/modules/common/content/AddButton'
const styles = require('./style')

export interface PayloadProps {
  totalBeginDate: string
  totalEndDate: string
  salespersonId: string
}

interface State {
  dataSource: CrmStat.SalesDetails[]
  firms: Array<{id: string, name: string}>
  sallers: Array<{id: string, name: string}>
  organ: string
  sale: string
  sal: string
  char: any
  pi: any
}

interface ValueProps {
  agencyId?: string,
  salesPerson?: Array<{id: string, name: string}>
}

class Main extends React.Component<{}, State> {
  public values: ValueProps = {
  }

  public SalespersonId = APP.keys.EnumSalespersonId

  public payload: PayloadProps = {
    totalBeginDate: moment().format('YYYY-MM-DD'),
    totalEndDate: moment().format('YYYY-MM-DD'),
    salespersonId: ''
  }

  public state: State = {
    dataSource: [],
    firms: [],
    sallers: [],
    organ: '',
    sale: '',
    sal: '',
    char: [],
    pi: []
  }

  public columns: ColumnProps<CrmStat.SalesDetails>[] = [
    {
      title: '销售',
      dataIndex: 'salesDetails.salesperson',
      width: 130,
      align: 'left',
      render: (text, record) => {
        return (
          <span>
            {record.key > 3 ? <span className={styles.ran}>{record.key}</span> : <span className={styles.rank}>{record.key}</span>}
            <span>{record.salesperson}</span>
            </span>
        )
      }
    },
    {
      title: '当前客户',
      dataIndex: 'salesDetails.customerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.customerNums
        )
      }
    },
    {
      title: '0%意向度',
      dataIndex: 'salesDetails.percentZeroCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.percentZeroCustomerNums
        )
      }
    },
    {
      title: '30%意向度',
      dataIndex: 'salesDetails.percentThirtyCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.percentThirtyCustomerNums
        )
      }
    },
    {
      title: '60%意向度',
      dataIndex: 'salesDetails.percentSixtyCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.percentSixtyCustomerNums
        )
      }
    },
    {
      title: '80%意向度',
      dataIndex: 'salesDetails.percentEightyCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.percentEightyCustomerNums
        )
      }
    },
    {
      title: '100%意向度',
      dataIndex: 'salesDetails.percentHundredCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.percentHundredCustomerNums
        )
      }
    },
    {
      title: '本月签单累计',
      dataIndex: 'salesDetails.signCustomerNums',
      width: 130,
      render : (text, record) => {
        return (
          record.signCustomerNums
        )
      }
    }
  ]

  public componentWillMount () {
    this.getFirms()
  }

  public getFirms () {
    getFirms().then((res) => {
      this.setState({
        firms: res,
        organ: res[0].id
      }, () => {
        this.getSales(res[0].id)
      })
    })
  }

  public getSales (companyId: string) {
    getSalesByCompany(companyId).then((res) => {
      const sales = res.map((item: any) => {
        return item.id
      })
      const sale = sales.join(',')
      this.payload.salespersonId = sale
      const sal = ''
      const dataSource = res.length > 0 ? this.state.dataSource : []
      if (res.length === 0) {
        this.setState({
          char: [],
          pi: []
        })
      }
      this.setState({
        dataSource,
        sallers: res,
        sale,
        sal
      }, () => {
        if (sales.length > 0) {
          this.fetchList()
        }
      })
    })
  }

  public fetchList () {
    getTrailRank(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.data.salesDetails.map((v: any, i: any) => {v.key = i + 1; return v}),
        char: res.data.reportTrackCustomerByDate,
        pi: res.data.reportCustomerSource
      })
    })
  }

  public export (exports: any) {
    const accessToken: any = localStorage.getItem('token')
    fetch(
      `/sys/crm-manage/v1/api/report/customer/export?totalBeginDate=${exports.totalBeginDate}&totalEndDate=${exports.totalEndDate}&salespersonId=${exports.salespersonId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': accessToken,
          'from': '4'
        }
      }
    )
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = exports.totalBeginDate + '~' + exports.totalEndDate + '销售统计表.xlsx'
      a.href = url
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
  }

  public render () {
    return (
      <div>
        <div style={{marginTop: 8}}>
          <Select
            value={this.state.organ}
            className='inline-block mr8'
            style={{width: 200}}
            placeholder='请选择机构'
            onChange={(value: string) => {
              this.values.agencyId = value
              this.getSales(value)
              this.setState({
                organ: value
              })
            }}
          >
            {
              this.state.firms.length > 0 &&
              this.state.firms.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                )
              })
            }
          </Select>
          <Select
            value={this.state.sal || undefined}
            className='inline-block mr8'
            style={{width: 200}}
            placeholder='请选择销售'
            onChange={(value: string) => {
              this.payload.salespersonId = value
              this.fetchList()
              this.setState({
                sal: value,
                dataSource: []
              })
            }}
          >
          {
            this.state.sallers.length > 0 && this.state.sallers.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              )
            })
          }
          </Select>
        </div>
        <div>
          <div style={{marginTop: 25}}>
            <Row>
              <Col span={8}>
                <Pie pi={this.state.pi}/>
              </Col>
              <Col span={12} offset={4}>
                <Bar char={this.state.char}/>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{marginBottom: 15}}>
          <span style={{fontSize: 14, color: '#333333'}}>销售明细表</span>
          <AddButton
            style={{float: 'right'}}
            icon={<APP.Icon type='export' />}
            title='导出'
            onClick={() => {
              this.export(this.payload)
            }}
          />
        </div>
        <div>
          <Table
            columns={this.columns}
            dataSource={this.state.dataSource}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </div>
      </div>
    )
  }
}
export default Main
