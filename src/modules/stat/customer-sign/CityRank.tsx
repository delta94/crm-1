import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
const styles = require('./style')

class Main extends React.Component<any> {
  public columns: ColumnProps<CrmStat.TotalByCityDetails>[] = [
    {
      title: '省份',
      width: '37%',
      dataIndex: 'totalByCity.provinceName',
      render: (text, record) => {
        return (
          <span>
            {record.key === this.props.totalByCity[this.props.totalByCity.length - 1].key ? '' : (record.key > 3 ? <span className={styles.ran}>{record.key}</span> : <span className={styles.rank}>{record.key}</span>)}
            <span>{record.provinceName}</span>
          </span>
        )
      }
    },
    {
      title: '机构',
      width: '40%',
      dataIndex: 'totalByCity.name',
      render: (text, record) => {
        return record.name
      }
    },
    {
      title: '新增客户数',
      width: '25%',
      dataIndex: 'totalByCity.value',
      render: (text, record) => {
        return record.value
      }
    }
  ]

  public render () {
    return (
      <div className={styles.tab}>
        <Table
          columns={this.columns}
          dataSource={this.props.totalByCity}
          pagination={false}
          scroll={{y: 300}}
        />
      </div>
    )
  }
}
export default Main
