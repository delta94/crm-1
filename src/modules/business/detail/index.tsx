import React from 'react'
import Profile from '@/modules/common/company-detail/Profile'
import BaseInfo from '@/modules/customer/BaseInfo'
import Record from '@/modules/customer/Record'
import Card from '@/components/Card'
import Tags from '@/components/tags'
import _ from 'lodash'
import moment from 'moment'
import { Button, Input, DatePicker, Icon } from 'antd'
import { connect } from 'react-redux'
import { verifyMessage } from '../api'
import { fetchTrackRecords } from '@/modules/customer/api'
const styles = require('./style')
interface Props {
  track?: boolean
  customerId: string
  type?: 'business' | 'open' | 'customer' | 'signed'
  detail?: Customer.DetailProps
  footer?: React.ReactNode
  getWrappedInstance?: (ins?: React.ReactInstance) => void
  onClose?: () => void
}
class Main extends React.Component<Props> {
  public state = {
    visible: true,
    infomation: {
      isOtherTrack: false,
      message: ''
    }
  }
  public defaultTrackRecord = [
    {
      field: 'tagTelephoneStatus',
      title: '电话状态',
      options: APP.keys.EnumContactStatus
    },
    {
      field: 'tagCustomerStatus',
      title: '需求状态',
      options: APP.keys.EnumNeedStatus
    },
    {
      field: 'tagIntention',
      title: '意向度',
      options: APP.keys.EnumIntentionality
    },
    {
      field: 'tagFollowupStatus',
      title: '跟进方式',
      options: APP.keys.EnumFollowWay
    }
  ]
  public footer = (
    <div className='text-right mt10'>
      <Button
        type='primary'
        className='mr5'
        onClick={this.save.bind(this)}
      >
        保存
      </Button>
      <Button type='ghost'>
        删除
      </Button>
    </div>
  )
  public trackRecord = _.cloneDeep(this.defaultTrackRecord)
  public componentWillMount () {
    verifyMessage(this.props.customerId).then((res) => {
      this.setState({
        infomation: res
      })
    })
  }
  public componentWillReceiveProps (props: Customer.Props) {
    if (this.props.detail.id !== props.detail.id) {
      this.trackRecord = _.cloneDeep(this.defaultTrackRecord)
      this.setState({
        visible: false
      }, () => {
        this.setState({
          visible: true
        })
      })
    }
  }
  public componentDidMount () {
    console.log('detail did mouiunt')
    if (this.props.getWrappedInstance) {
      console.log('detail did mouiunt')
      this.props.getWrappedInstance(this)
    }
  }
  public save () {
    const sourceBaseinfo: any = this.refs.baseinfo
    const baseinfo = sourceBaseinfo.getWrappedInstance()
    const p = baseinfo.refs.wrappedComponent.save()
    p.then((res: any) => {
      const detail = this.props.detail
      if (detail.trackRecord) {
        const payload = {
          pageNum: 1,
          pageSize: 999
        }
        fetchTrackRecords(detail.id, payload).then((res2) => {
          APP.dispatch<Customer.Props>({
            type: 'change customer data',
            payload: {
              trackRecords: res2.data
            }
          })
        })
        detail.trackRecord = undefined
      }
      APP.dispatch({
        type: 'change customer data',
        payload: {
          detail
        }
      })
      this.trackRecord = _.cloneDeep(this.defaultTrackRecord)
      this.setState({
        visible: false
      }, () => {
        this.setState({
          visible: true
        })
      })
      return res
    })
    return p
  }
  public disabledDate (current: any) {
    return current && current < moment().subtract(1, 'days').endOf('day')
  }
  public handleChange (field: string, value: any) {
    const detail = this.props.detail
    if (field === 'trackRecord') {
      value = Object.assign({}, detail.trackRecord, value)
    }
    _.set(detail, field, value)
    APP.dispatch({
      type: 'change customer data',
      payload: {
        detail
      }
    })
  }
  public render () {
    const type = this.props.type || 'customer'
    const {infomation} = this.state
    return (
      <div>
        <div style={infomation.isOtherTrack ? {display: 'block'} : {display: 'none'}}>
          <div style={{textAlign: 'center', color: 'red'}}>
            {infomation.message}
          </div>
        </div>
        <div>
        <span
          className={styles['colse-icon']}
          onClick={() => this.props.onClose()}
        >
          <Icon type='close' theme='outlined' />
        </span>
        <div className={styles.container}>
          <div>
            <Profile
              type={type}
            />
          </div>
          <div className='clear' style={{marginTop: 20}}>
            <div className={styles.left}>
              <Card
                title='基本信息'
                showFold
              >
                <BaseInfo
                  showTel={!infomation.isOtherTrack}
                  ref='baseinfo'
                  customerId={this.props.customerId}
                  type={type}
                  track={infomation.isOtherTrack}
                />
              </Card>
            </div>
            <div className={styles.right}>
              {
                this.state.visible &&
                <Card title='跟进小记'>
                  <Tags
                    track={infomation.isOtherTrack}
                    labelSpan={3}
                    className='mb10'
                    dataSource={this.trackRecord}
                    parser={(value) => {
                      return value[0] ? Number(value[0].value) : undefined
                    }}
                    onChange={(value) => {
                      this.handleChange('trackRecord', value)
                    }}
                  />
                  <Input.TextArea
                    disabled={infomation.isOtherTrack}
                    className='mt10'
                    placeholder='请输入备注'
                    onChange={(e) => {
                      console.log(e.target.value, 'textarea change')
                      this.handleChange('trackRecord.remark', e.target.value)
                    }}
                  />
                  <div className='mt10' >
                    下次跟进:&nbsp;&nbsp;
                    <DatePicker
                      disabled={infomation.isOtherTrack}
                      placeholder=''
                      disabledDate={this.disabledDate}
                      onChange={(date) => {
                        this.handleChange('trackRecord.appointTime', date.format('YYYY-MM-DD HH:mm:ss'))
                      }}
                    />
                  </div>
                </Card>
              }
            </div>
            </div>
          </div>
          <div>
            <Record
              type='business'
              customerId={this.props.customerId}
              height={180}
            />
          </div>
        </div>
        <div>
          {this.props.footer || this.footer}
        </div>
      </div>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
})(Main)
