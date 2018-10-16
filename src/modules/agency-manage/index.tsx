import React from 'react'
import ContentBox from '@/modules/common/content'
import { Tabs } from 'antd'
import AddButton from '@/modules/common/content/AddButton'
import Direct from './direct'
import Agent from './agent'
import Accounting from './accounting'
import Modal from 'pilipa/libs/modal'
import AccountingModal from './accounting/AccountingModal'
import ChannelModal from './agent/ChannelModal'
const TabPane = Tabs.TabPane
interface States {
  defaultActiveKey: string
}
class Main extends React.Component<null, States> {
  public state: States = {
    defaultActiveKey: 'direct'
  }
  public callback (value?: string) {
    this.setState({
      defaultActiveKey: value
    })
  }
  public add () {
    console.log(this.state.defaultActiveKey)
    if (this.state.defaultActiveKey === 'direct') {}
    if (this.state.defaultActiveKey === 'agent') { this.addAgent() }
    if (this.state.defaultActiveKey === 'accounting') { this.addAccounting() }
  }
  public addAgent () {
    const modal = new Modal({
      content: <ChannelModal />,
      title: '新增代理商',
      mask: true,
      style: 'width: 800px;',
      onOk: () => {
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public addAccounting () {
    const modal = new Modal({
      content: <AccountingModal />,
      title: '新增核算中心',
      mask: true,
      style: 'width: 500px;',
      onOk: () => {
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
    modal.show()
  }
  public render () {
    return (
      <ContentBox
        title='机构管理'
        rightCotent={(
          <AddButton
            title='添加'
            onClick={() => {
              this.add()
            }}
          />
        )}
      >
        <Tabs
          animated={false}
          defaultActiveKey='direct'
          onChange={this.callback.bind(this)}
        >
          <TabPane tab='直营' key='direct'>
            <Direct />
          </TabPane>
          <TabPane tab='代理商' key='agent'>
            <Agent />
          </TabPane>
          <TabPane tab='核算中心' key='accounting'>
            <Accounting />
          </TabPane>
        </Tabs>
      </ContentBox>
    )
  }
}

export default Main
