import React from 'react'
import moment from 'moment'
import { Select, Icon, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFirms, getSalesRank } from '@/modules/stat/api'
import { getSalesByCompany } from '@/modules/common/api'
import Condition, { ConditionOptionProps } from '@/modules/common/search/Condition'
import Line from './Line'
import AddButton from '@/modules/common/content/AddButton'
const styles = require('./style')

export interface PayloadProps {
  totalBeginDate: string
  totalEndDate: string
  salespersonId: string
}

interface State {
  dataSource: CrmStat.CallDetailInfos[]
  /** 机构列表 */
  firms: Array<{id: string, name: string}>
  /** 销售列表 */
  sallers: Array<{id: string, name: string}>
  /** 机构初始值 */
  organ: string
  /** 传入的销售人员 */
  sale: string
  /** 销售人员初始值 */
  sal: string
  /** 圆角矩形数据 */
  strip: any
  /** 每日呼叫趋势图 */
  char: CrmStat.ReportByDays[]
  /** 折叠是否隐藏 */
  extshow: boolean
}

interface ValueProps {
  agencyId?: string,
  salesPerson?: Array<{id: string, name: string}>
}

class Main extends React.Component<{}, State> {
  public values: ValueProps = {
  }
  public SalespersonId = APP.keys.EnumSalespersonId

  public companyTypeList: string[] = ['Agent', 'DirectCompany']

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
    strip: {
      callTotalNums: 0,
      callSuccessNums: 0,
      totalCallDuration: 0,
      callOutTotalNums: 0,
      averageCallSuccessPercent: 0
    },
    char: [],
    extshow: false
  }

  public condition: ConditionOptionProps[] = [
    {
      field: 'date',
      label: ['时间'],
      type: 'date',
      value: '0',
      options: [{
        label: '今天',
        value: '0'
      }, {
        label: '昨天',
        value: '-1'
      }, {
        label: '本周',
        value: (() => {
          const date = new Date()
          const D = date.getDay() - 1
          return '-' + D
        })()
      }, {
        label: '本月',
        value: (() => {
          const date = new Date()
          const D = date.getDate() - 1
          return '-' + D
        })()
      }]
    }
  ]

  public columns: ColumnProps<CrmStat.CallDetailInfos>[] = [
    {
      title: '销售',
      dataIndex: 'callDetailInfos.salespersonName',
      align: 'left',
      width: 130,
      render: (text, record) => {
        return (
          <span>
            {record.key > 3 ? <span className={styles.ran}>{record.key}</span> : <span className={styles.rank}>{record.key}</span>}
            <span>{record.salespersonName}</span>
          </span>
        )
      }
    },
    {
      title: '通话量',
      dataIndex: 'callTotalNums',
      width: 130,
      render: (text, record) => {
        return (
          record.callInTotalNums + record.callOutTotalNums
        )
      }
    },
    {
      title: '接通量',
      dataIndex: 'callDetailInfos.callSuccessNums',
      width: 130,
      render: (text, record) => {
        return (
          record.callSuccessNums
        )
      }
    },
    {
      title: '接通率',
      dataIndex: 'averageCallSuccessPercent',
      width: 130,
      render: (text, record) => {
        return (
          (Math.round((record.callSuccessNums / (record.callInTotalNums + record.callOutTotalNums)) * 100) || 0) + '%'
        )
      }
    },
    {
      title: '通话时长',
      dataIndex: 'callDetailInfos.totalCallDuration',
      width: 130,
      render: (text, record) => {
        return (
          APP.fn.formatDuration(record.totalCallDuration)
        )
      }
    },
    {
      title: '1"- 30"',
      dataIndex: 'callDetailInfos.callSuccessLte30SecondNums',
      width: 130,
      render: (text, record) => {
        return (
          record.callSuccessLte30SecondNums
        )
      }
    },
    {
      title: '30"- 60"',
      dataIndex: 'callDetailInfos.callSuccessLte60SecondNums',
      width: 130,
      render: (text, record) => {
        return (
          record.callSuccessLte60SecondNums
        )
      }
    },
    {
      title: '> 60"',
      dataIndex: 'callDetailInfos.callSuccessGt60SecondNums',
      width: 130,
      render: (text, record) => {
        return (
          record.callSuccessGt60SecondNums
        )
      }
    }
  ]

  public componentWillMount () {
    this.getFirms()
  }

  public getFirms () {
    getFirms(this.companyTypeList).then((res) => {
      console.log(res, 'redredrerdred')
      this.setState({
        firms: res,
        organ: res[0].id
      }, () => {
        this.getSales(res[0].id)
      }
      )
    })
  }

  public getSales (companyId: string) {
    getSalesByCompany(companyId).then((res) => {
      const sales = res.map((item: any) => {
        return item.id
      })
      const sal = ''
      const sale = res.length > 0 ? sales.join(',') : ''
      const dataSource = res.length > 0 ? this.state.dataSource : []
      this.payload.salespersonId = sale
      if (res.length === 0) {
        this.setState({
          strip: {
            callTotalNums: 0,
            callSuccessNums: 0,
            totalCallDuration: 0,
            callOutTotalNums: 0,
            averageCallSuccessPercent: 0
          },
          char: []
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
    return getSalesRank(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.data.callDetailInfos.map((v: any, i: any) => {v.key = i + 1; return v}),
        strip: res.data,
        char: res.data.reportByDays
      })
    })
  }

  public onDateChange (value: {[field: string]: {label: string, value: string}}) {
    if (value.date.value.split('至').length === 2) {
      this.payload.totalBeginDate = value.date.value.split('至')[0]
      this.payload.totalEndDate = value.date.value.split('至')[1]
    } else {
      this.payload.totalBeginDate = moment().add(value.date.value, 'day').format('YYYY-MM-DD')
      if (value.date.value === '-1') {
        this.payload.totalEndDate = this.payload.totalBeginDate
      } else {
        this.payload.totalEndDate = moment().format('YYYY-MM-DD')
      }
    }
    this.fetchList()
  }

  // 导出
  public export (exports: any) {
    const accessToken: any = localStorage.getItem('token')
    fetch(
      `/sys/crm-manage/v1/api/report/sales/export?totalBeginDate=${exports.totalBeginDate}&totalEndDate=${exports.totalEndDate}&salespersonId=${exports.salespersonId}`,
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
      a.download = exports.totalBeginDate + '~' + exports.totalEndDate + '工作统计表.xlsx'
      a.href = url
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
  }

  // 搜索框折叠
  public handleSwitch () {
    this.setState({
      extshow: !this.state.extshow
    })
  }
  public render () {
    const {firms, dataSource, strip, char } = this.state
    return (
      <div>
        <Condition
          style={{marginLeft: -36}}
          onChange={this.onDateChange.bind(this)}
          dataSource={this.condition}
        />
        <div>
          <img
            src={require(`@/assets/images/${this.state.extshow ? 'up' : 'down'}.svg`)}
            style={{cursor: 'pointer', float: 'right', marginTop: -5}}
            width='14'
            height='14'
            onClick={this.handleSwitch.bind(this)}
          />
        </div>
        <div style={this.state.extshow ? {display:'block', marginTop: 8} : {display: 'none'}}>
          <Select
            value={this.state.organ}
            className='inline-block mr8'
            style={{width: 200}}
            placeholder='请选择机构'
            onChange={(value: string) => {
              this.values.agencyId = value
              this.getSales(value)
              this.setState({organ: value})
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
              this.setState({
                sal: value,
                dataSource: []
              })
              this.fetchList()
            }}
          >
          {
            this.state.sallers.length > 0 && this.state.sallers.map((item) => {
              return (
                <Select.Option key={item.id}>{item.name}</Select.Option>
              )
            })
          }
          </Select>
        </div>

        <div className={styles.pane}>
          <div className={styles.con}>
            <div className={styles.small}>通话量</div>
            <div className={styles.big}>{strip.callTotalNums}</div>
            {/* <div className={styles.small}>
              <span>环比</span>
              <span style={{marginLeft: 115}}>30%<Icon type='down' style={{paddingLeft: 5}}></Icon></span>
            </div> */}
          </div>
          <div className={styles.con}>
            <div className={styles.small}>呼出量</div>
            <div className={styles.big}>{strip.callOutTotalNums}</div>
            {/* <div className={styles.small}>
              <span>环比</span>
              <span style={{marginLeft: 115}}>30%<Icon type='down' style={{paddingLeft: 5}}></Icon></span>
            </div> */}
          </div>
          <div className={styles.con}>
            <div className={styles.small}>接通量</div>
            <div className={styles.big}>{strip.callSuccessNums}</div>
            {/* <div className={styles.small}>
              <span>环比</span>
              <span style={{marginLeft: 115}}>30%<Icon type='down' style={{paddingLeft: 5}}></Icon></span>
            </div> */}
          </div>
          <div className={styles.con}>
            <div className={styles.small}>通话率</div>
            <div className={styles.big}>
              {Math.round(strip.averageCallSuccessPercent) + '%'}
            </div>
            {/* <div className={styles.small}>
              <span>环比</span>
              <span style={{marginLeft: 115}}>30%<Icon type='down' style={{paddingLeft: 5}}></Icon></span>
            </div> */}
          </div>
          <div className={styles.con}>
            <div className={styles.small}>通话时长</div>
            <div className={styles.big}>{APP.fn.formatDuration(strip.totalCallDuration)}</div>
            {/* <div className={styles.small}>
              <span>环比</span>
              <span style={{marginLeft: 115}}>30%<Icon type='down' style={{paddingLeft: 5}}></Icon></span>
            </div> */}
          </div>
        </div>

        <div style={{marginTop: 20}}>
          <Line char={char}/>
        </div>

        <div style={{marginBottom: 15}}>
          <span style={{fontSize: 14, color: '#333333'}}>排名</span>
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
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </div>
      </div>
    )
  }
}
export default Main
