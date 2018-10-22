import {  Form, Checkbox, Input, Select, Row, Col, Table, Button } from 'antd'
import React from 'react'
import { withRouter } from 'react-router'
import HCframe from '@/modules/common/components/HCframe'
import Service from '@/modules/outsite/services'
import { Map } from '@/modules/outsite/types/outsite'
import { isArray } from 'util'
import _ from 'lodash'
import { TaskItem } from '@/modules/outsite/types/outsite'
import TaskSort from './TaskSort'
import { ColumnProps } from 'antd/lib/table'
const styles = require('@/modules/outsite/styles/tpllist.styl')
const FormItem = Form.Item
const Option = Select.Option

interface States {
  modalVisible: boolean,
  personID: string
}

/*编辑系统任务   未完成*/
class Main extends React.Component<any, any> {
  public params: Map<string> = {}
  // 全部的子任务 key id, val item
  public suballMap: Map<any> = {}
  public suballList: Array<any> = []
  public productList: Array<any> = []
  constructor (props: any) {
    super(props)
    // 从接口获取
    // this.suballList = vlist // this.initDecoratorData(vlist)
    // this.suballMap = this.arr2map(this.suballList, 'id')

    this.state = {
      dataSource: {
        id: '1211',
        customerName:'北京爱康鼎科技有限公司',
        workNo:'XX10001',
        startTime:'2018-09-25'
      },
      modalVisible: false,
      personID: '',
      subList: [], // 全部子任务列表
      subMap: {}, // 子任务id: item map
      subGroup: {}, // 按分类分组子任务列表
      formdata:{
        name: '',
        priority: '',
        status: 'NORMAL',
        productId: '',
        productName: '',
        subList: [] // vlist
      },
      checkedIdMap: {} // this.arr2map(vlist, 'id') // 默认配置选中项
    }
  }

  public componentWillMount () {
    this.params = this.props.match.params
    this.getSublist()
    this.getItem()
    console.log('params::', this.params, APP.user)
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

  // 获取商品列表
  public getProductList () {
    Service.getProductList().then((res: any) => {
      this.setState({

      })
    })
  }

  // 获取当前任务
  public getItem () {
    if (!this.params.id) {
      return
    }
    let checkedIdMap: Map<any> = {}
    Service.getTplItemById(this.params.id).then((item: TaskItem) => {
      item.subList.map((subitem: any, i: number) => {
        subitem.sort = i + 1
      })
      checkedIdMap = this.arr2map(item.subList, 'subId')
      this.setState({
        formdata: item,
        checkedIdMap
      })
    })
  }

  // 获取子任务列表
  public getSublist () {
    return Service.getTplSublist({}).then((data: any) => {
      data.map((item: any, i: number) => {
        data[i].subId = item.id
      })
      this.setState({
        subList: data,
        subMap: this.arr2map(data),
        subGroup: Service.getTplSublistGroupByCate(data)
      }, () => {
        console.log('get list::', this.state)
      })
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

  // 选择子任务
  public onCheckItem (e: any) {
    let { formdata } = this.state
    const { checkedIdMap } = this.state
    let { subList } = formdata
    const val = e.target.value
    if (e.target.checked) {
      if (checkedIdMap && !checkedIdMap[val]) {
        // 缓存已经选中的子任务
        checkedIdMap[val] = this.state.subMap[e.target.value]
        const nitem = checkedIdMap[val]
        console.log('new item::', val, nitem)
        nitem.sort = subList.length + 1
        subList.push(nitem)
        formdata = {
          ...formdata,
          subList
        }
        this.setState({
          checkedIdMap,
          formdata
        })
      }
    } else {
      delete checkedIdMap[val]
      subList = _.filter(subList, (item: TaskItem) => {
        console.log(val, item.id, item.subId, item)
        return item.subId !== val
      })
      subList.map((item: TaskItem, i: number) => {
        subList[i].sort = i + 1
        checkedIdMap[item.subId] = item
      })
      formdata = {
        ...formdata,
        subList
      }
      this.setState({
        formdata,
        checkedIdMap
      })
    }
    /*
    const { checkedIdMap } = this.state
    if (e.target.checked) {
      // 缓存已经选中的子任务
      checkedIdMap[e.target.value] = this.state.subMap[e.target.value]
    } else {
      delete checkedIdMap[e.target.value]
    }
    console.log('........', e.target.value, this.state.checkedIdMap, e.target)
    this.setState({
      checkedIdMap
    }, () => {
      // 排序
      this.sortData()
    })
    console.log('checked::', e, this.state.checkedIdMap)
    */
  }

  // 切换排序
  public syncFormdata (k: string, v: any) {
    console.log('sync::', k, v)
    const { formdata } = this.state
    formdata[k] = v
    this.setState({
      formdata
    })
  }

  // 保存
  public onSave (data: TaskItem[]) {
    const { formdata } = this.state
    formdata.subList = data
    console.log('save::', formdata)
    // @181018 接口方要求status 必传 NORMAL, :(
    formdata.status = 'NORMAL'
    Service.addTplItem(formdata).then(() => {
      APP.success('保存成功')
      APP.history.push(`/outsite/tasktpl/list`)
    })
  }

  public render () {
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
                      <Input
                        name='name'
                        value={this.state.formdata.name}
                        placeholder={`任务名称`}
                        onChange={(ev: any) => {
                          this.syncFormdata('name', ev.target.value)
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label='是否优先级' {...formItemLayout}>
                      <Select
                        placeholder={`是否优先级`}
                        value={this.state.formdata.priority}
                        onChange={(val: any) => {
                          this.syncFormdata('priority', val)
                        }
                        }
                      >
                        {this.dict2options(Service.taskTplPriorityDict)}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label='关联商品' {...formItemLayout}>
                      <Select
                        placeholder={`关联商品`}
                        value={this.state.formdata.productId}
                        onChange={(val: any) => {
                          this.syncFormdata('productId', val)
                        }
                        }
                      >
                        {this.dict2options({
                          1: '商品1',
                          2: '商品2'
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                    <Col span={14}>
                      {
                        // 遍历分类
                        this.dict2list(Service.taskTplCateDict).map((item: any, index: number) => {
                          return (
                            <div key={`cate-${index}`} className={styles['page-hc']}>
                              <div className={styles['hc-h']}>
                                {item.val}
                              </div>
                              <div className={styles['hc-c']}>
                              {
                                this.state.subGroup[item.key] && this.state.subGroup[item.key].map((checkitem: any, i: number) => {
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
                      <TaskSort
                        dataSource={this.state.formdata.subList}
                        onOk={this.onSave.bind(this)}
                      />
                    </Col>
                </Row>
              </Form>
              </HCframe>
            </div>
    )
  }
}
export default withRouter(Main)
