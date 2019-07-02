import React from 'react'
import { Tabs } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import Sound from './Sound'
const styles = require('./style')
interface Props extends Customer.Props {
  customerId?: string
  height?: number
  type?: 'business' | 'open' | 'customer' | 'signed' | 'visit'
}
interface State {
  playId?: any
}
class Main extends React.Component<Props, State> {
  public state: State = {}
  public getTags (item: Customer.TrackRecord) {
    const nodes: React.ReactNode[] = []
    if (item.tagIntention > -1) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumIntentionality-${item.tagIntention}`]}
        </span>
      )
    }
    if (item.tagCustomerStatus > -1) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumNeedStatus-${item.tagCustomerStatus}`]}
        </span>
      )
    }
    if (item.tagFollowupStatus > -1) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumFollowWay-${item.tagFollowupStatus}`]}
        </span>
      )
    }
    if (item.tagTelephoneStatus > -1) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumContactStatus-${item.tagTelephoneStatus}`]}
        </span>
      )
    }
    if (item.tagFollowUpClassification > -1) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumFollowUpClassification-${item.tagFollowUpClassification}`]}
        </span>
      )
    }
    console.log(item.telephoneStatus, `EnumVisitTelStatus-${item.telephoneStatus}`, '111111111')
    if (item.telephoneStatus > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitTelStatus-${item.telephoneStatus}`]}
        </span>
      )
    }
    if (item.contract > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitContract-${item.contract}`]}
        </span>
      )
    }
    if (item.handover > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitHandover-${item.handover}`]}
        </span>
      )
    }
    if (item.confirmTax > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitTax-${item.confirmTax}`]}
        </span>
      )
    }
    if (item.faq > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitFAQ-${item.faq}`]}
        </span>
      )
    }
    if (item.reason > 0) {
      nodes.push(
        <span className={styles.tag}>
          {APP.dictionary[`EnumVisitTelReason-${item.reason}`]}
        </span>
      )
    }
    if (item.appointTime) {
      nodes.push(
        <span className={styles.tag}>
          {moment(item.appointTime).format('YYYY-MM-DD')}
        </span>
      )
    }
    return nodes
  }
  public render () {
    const { trackRecords, clueRecords, callRecords } = this.props
    const relatedCompany = (this.props.detail.relatedCompany || '').split(',')
    return (
      <div>
        <Tabs animated={false} defaultActiveKey='1'>
          <Tabs.TabPane tab='跟进记录' key='1'>
            <div style={{overflowY: 'auto', maxHeight: this.props.height }}>
            {
              trackRecords.length > 0 && trackRecords.map((item, index) => {
                return (
                  <div className={styles.record} key={index}>
                    <div className={styles['line-height']} style={{color: 'black'}}>
                      <span style={{marginRight: 10}}>{item.salesperson}</span>
                      <span>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                    <div>{item.remark}</div>
                    {
                      this.getTags(item).length > 0 && (
                        <div>
                          {this.getTags(item)}
                        </div>
                      )
                    }
                  </div>
                )
              })
            }
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab='通话记录' key='2'>
            <div style={{overflowY: 'auto', maxHeight: this.props.height }}>
            {
              callRecords.length > 0 && callRecords.map((item, index) => {
                return (
                  <div className={styles.record} key={index}>
                    <div className={styles['line-height']} style={{color: 'black'}}>
                      <span style={{marginRight: 10}}>{item.salespersonName}</span>
                      <span>{moment(item.callTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                    <div>
                      <span>{item.telephone}</span>
                      <span>{item.phoneAddress}</span>
                      <span style={{paddingLeft: 20}}>
                        ({APP.fn.formatDuration(item.callDuration)})
                      </span>
                      {item.mediaUrl && (
                        <Sound
                          playing={item.id === this.state.playId}
                          onClick={() => {
                            this.setState({
                              playId: item.id
                            })
                          }}
                          url={item.mediaUrl}
                        />
                      )}
                    </div>
                  </div>
                )
              })
            }
            </div>
          </Tabs.TabPane>
          {
            this.props.type !== 'visit' &&
            <Tabs.TabPane tab='线索记录' key='3'>
              <div style={{overflowY: 'auto', maxHeight: this.props.height }}>
                {
                  clueRecords.length > 0 && clueRecords.map((item, index) => {
                    return (
                      <div className={styles.record} key={index}>
                        <div className={styles['line-height']} style={{color: 'black'}}>
                          <span style={{marginRight: 10}}>{item.salesperson}</span>
                          <span>{moment(item.createTime).format('YYYY-MM-DD')}</span>
                        </div>
                        <div>{item.remark}</div>
                      </div>
                    )
                  })
                }
              </div>
            </Tabs.TabPane>
          }
          {
            ['business', 'open', 'customer'].indexOf(this.props.type) > -1 &&
            <Tabs.TabPane tab='相关公司记录' key='4'>
              <div style={{overflowY: 'auto', maxHeight: this.props.height }} className={styles.record}>
                {
                  relatedCompany.map((item, index) => {
                    return (
                      <li key={index} style={{marginBottom: 5}}>{item}</li>
                    )
                  })
                }
              </div>
            </Tabs.TabPane>
          }
        </Tabs>
      </div>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
})(Main)
