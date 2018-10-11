import {  Icon, Form, Checkbox, Input, Select, Row, Col, Table, Button } from 'antd'
import React from 'react'
import { withRouter } from 'react-router'
import HCframe from '@/modules/common/components/HCframe'
import Service from '@/modules/outsite/services'
import { Map } from '@/modules/outsite/types/outsite'
import { isArray } from 'util'
import _ from 'lodash'

const styles = require('@/modules/outsite/styles/tpllist.styl')
const FormItem = Form.Item
const Option = Select.Option

interface States {
  modalVisible: boolean,
  personID: string
}

const vlist: any = [
  {
    id: 1,
    mainId: 1,
    subId: 2,
    sort: null,
    name: '核名',
    status: 'normal',
    type: 'sub',
    category: 'tax',
    delFlag: 0,
    priority: 'close'
  }, {
    id: 2,
    mainId: 1,
    subId: 3,
    sort: null,
    name: '网上申请',
    status: 'normal',
    type: 'sub',
    category: 'tax',
    delFlag: 0,
    priority: 'close'
  }, {
    id: 3,
    mainId: 1,
    subId: 4,
    sort: null,
    name: '网上申请3',
    status: 'normal',
    type: 'sub',
    category: 'tax',
    delFlag: 0,
    priority: 'close'
  }, {
    id: 4,
    mainId: 1,
    subId: 5,
    sort: null,
    name: '网上申请4',
    status: 'normal',
    type: 'sub',
    category: 'tax',
    delFlag: 0,
    priority: 'close'
  }]

/*编辑系统任务   未完成*/
class Main extends React.Component<any, any> {
  public params: Map<string> = {}
  // 全部的子任务 key id, val item
  public suballMap: Map<any> = {}
  public suballList: Array<any> = []
  constructor (props: any) {
    super(props)
    this.suballList = vlist // this.initDecoratorData(vlist)
    this.suballMap = this.arr2map(this.suballList, 'id')

    this.state = {
      dataSource:{
        id: '1211',
        customerName:'北京爱康鼎科技有限公司',
        workNo:'XX10001',
        startTime:'2018-09-25'
      },
      modalVisible: false,
      personID: '',
      formdata:{
        name: '',
        priority: '',
        goodsId: '',
        goodsName: '',
        sublist: [] // vlist
      },
      checkedIdMap: {} // this.arr2map(vlist, 'id') // 默认配置选中项
    }
  }

  public componentWillMount () {
    this.params = this.props.match.params
    console.log('params::', this.params)
  }

  // 初始化数据
  public initDecoratorData (data: any) {
    return data.map((item: any) => {
      return {
        ...item,
        sort: item.sort === null ? 1 : item.sort
      }
    })
  }

  // 数组转map
  public arr2map (arr: Array<any>, key: string = 'id', val: any = '') {
    const rst: Map<any> = {}
    if (isArray(arr)) {
      arr.map((item: any) => {
        rst[item[key]] = val ? item[val] : item
      })
    }
    return rst
  }

  // 根据字典生成下拉
  public dict2list (dict: Map<any>) {
    const clist: any = []
    for (const i in dict) {
      if (i) {
        clist.push({
          key: i,
          val: dict[i]
        })
      }
    }
    return clist
  }
  public dict2options (dict: Map<any>) {
    return this.dict2list(dict).map((item: any) => {
      return (
        <Option key={`option-${item.key}`} value={item.key}>{item.val}</Option>
      )
    })
  }

  public onChange () {
    console.log('form change::', arguments)
  }

  public sortData () {
    let { formdata } = this.state
    const { sublist } = formdata.sublist

    const newlist: Array<any> = []
    let i: number = 0
    _.forEach(this.state.checkedIdMap, (item: any) => {
      i++
      item.sort = item.sort ? item.sort : i
      console.log(i, item.id, item)
      newlist.push(item)
    })

    // 排序
    // _

    formdata = {
      ...formdata,
      sublist: newlist
    }

    this.setState({
      formdata
    })
    return sublist
  }

  // 选择子任务
  public onCheckItem (e: any) {
    const { checkedIdMap } = this.state
    if (e.target.checked) {
      // 缓存已经选中的子任务
      checkedIdMap[e.target.value] = this.suballMap[e.target.value]
    } else {
      delete checkedIdMap[e.target.value]
    }
    console.log('........', this.state.checkedIdMap)
    this.setState({
      checkedIdMap
    }, () => {
      // 排序
      this.sortData()
    })
    console.log('checked::', e, this.state.checkedIdMap)
  }

  // 切换排序
  public sortItem (item: any, action: 'up' | 'down') {
    console.log('sort item::', item)
    const {checkedIdMap} = this.state
    if (action === 'up') {
      if (item.sort !== 1) {
        const nitem = this.state.formdata.sublist[item.sort - 2]
        nitem.sort = nitem.sort + 1
        item.sort = item.sort - 1
        checkedIdMap[item.id] = item
        checkedIdMap[nitem.id] = nitem
      }
    }
    if (action === 'down') {
      if (item.sort !== this.state.formdata.sublist.length) {
        const nitem = this.state.formdata.sublist[item.sort]
        nitem.sort = nitem.sort - 1
        item.sort = item.sort + 1
        checkedIdMap[item.id] = item
        checkedIdMap[nitem.id] = nitem
      }
    }
    this.setState({
      checkedIdMap
    }, () => {
      this.sortData()
    })
  }

  // 保存
  public onSave () {
    console.log('save::', this.state.formdata)
  }

  public render () {
    console.log('state::', this.state)
    const cols: any = [{
      title: '顺序',
      dataIndex: 'sort',
      render: (k: any, item: any) => {
        return item.sort ? item.sort : 1
      }
    }, {
      title: '名称',
      dataIndex: 'name'
    }, {
      title: '排序',
      dataIndex: 'take',
      render: (k: any, item: any) => {
        return (
          <span>
            <span
              className={`likebtn ${item.sort === 1 ? styles.disabled : ''}`}
              onClick={() => {
                if (item.sort === 1) {
                  return
                }
                this.sortItem.bind(this)(item, 'up')
              }}
            >
              <Icon type='caret-up' />
            </span>
            <span
              className={`likebtn ${item.sort === this.state.formdata.sublist.length ? styles.disabled : ''}`}
              onClick={() => {
                if (item.sort === this.state.formdata.sublist.length) {
                  return
                }
                this.sortItem.bind(this)(item, 'down')
              }}
            >
              <Icon type='caret-down' />
            </span>
          </span>
        )
      }
    }]
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
            <div className={styles.container}>
              <HCframe title='编辑系统任务'>
              <Form
                onChange={this.onChange.bind(this)}
              >
                <Row>
                  <Col span={5}>
                    <FormItem label='任务名称' {...formItemLayout}>
                      <Input name='name' placeholder={`任务名称`}/>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label='是否优先级' {...formItemLayout}>
                      <Select placeholder={`是否优先级`}>
                        {this.dict2options(Service.taskPriorityDict)}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label='关联商品' {...formItemLayout}>
                      <Select placeholder={`关联商品`}>
                        {this.dict2options(Service.taskCateDict)}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                    <Col span={14}>
                      {
                        // 遍历分类
                        this.dict2list(Service.taskCateDict).map((item: any, index: number) => {
                          return (
                            <div key={`cate-${index}`} className={styles['page-hc']}>
                              <div className={styles['hc-h']}>
                                {item.val}
                              </div>
                              <div className={styles['hc-c']}>
                              {
                                this.suballList.map((checkitem: any, i: number) => {
                                  return (
                                    <Checkbox
                                      key={`checkbox-${index}-${i}`}
                                      indeterminate={this.state.indeterminate}
                                      value={checkitem.id}
                                      onChange={this.onCheckItem.bind(this)}
                                      checked={this.state.checkedIdMap[checkitem.id]} // 根据回传结果设置
                                    >
                                      {checkitem.name}
                                    </Checkbox>
                                  )
                                })
                              }
                              </div>
                            </div>
                          )
                        })
                      }
                    </Col>
                    <Col span={10}>
                      <Table
                        bordered={false}
                        size={`small`}
                        rowClassName={(record, index) => {
                          return index % 2 === 0 ? styles.roweven : styles.rowodd
                        }}
                        columns={cols}
                        dataSource={this.state.formdata.sublist}
                        pagination={false}
                      />
                      <div className={styles.actbtns}>
                        <Button onClick={this.onSave.bind(this)} type={`primary`}>保存</Button>
                      </div>
                    </Col>
                </Row>
              </Form>
              </HCframe>
            </div>
    )
  }
}
export default withRouter(Main)
