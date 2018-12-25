import React from 'react'
import moment from 'moment'
import { Select, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Condition, { ConditionOptionProps } from '@/modules/common/search/Condition'

class Main extends React.Component {

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
        value: 'week'
      }, {
        label: '本月',
        value: 'month'
      }]
    }
  ]

  public render () {
    return (
      <div>
        <Condition
          // onChange={this.onDateChange.bind(this)}
          dataSource={this.condition}
        />
      </div>
    )
  }
}
export default Main
