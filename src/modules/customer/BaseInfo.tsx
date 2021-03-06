import React from 'react'
import { Row, Col, Icon, Button, Select, Form, DatePicker } from 'antd'
import AutoComplete from 'pilipa/libs/auto-complete'
import { FormComponentProps } from 'antd/lib/form/Form'
import Input from '@/components/input'
import TextArea from '@/components/textarea'
import FormItemLayout from '@/components/form/Item1'
import Modal from 'pilipa/libs/modal'
import LinkMain from '@/modules/common/link-man'
import AddButton from '@/modules/common/content/AddButton'
import Provider from '@/components/Provider'
import _ from 'lodash'
import { changeCustomerDetailAction } from './action'
import { connect } from 'react-redux'
import { addCustomer, addBusinessCustomer, updateCustomer } from './api'
import { fetchRegion } from '@/modules/common/api'
import CompanySearch from '@/modules/signed/detail/CompanySearch'
import LinkMan from './linkman'
import moment from 'moment'
const styles = require('./style')
const Option = Select.Option
const FormItem = Form.Item
interface Props extends Customer.Props, FormComponentProps {
  track?: boolean
  customerId?: string
  onClose?: () => void
  flowNow?: () => void
  reset?: boolean
  type?: 'business' | 'open' | 'customer' | 'signed'
  showTel?: boolean
  cityCode?: string
}
interface State {
  cityName: string
  cityList: Common.RegionProps[]
  areaName: string
  areaList: Common.RegionProps[]
}
class Main extends React.Component<Props> {
  public linkman: any
  public state: State = {
    cityName: '',
    areaName: '',
    cityList: [],
    areaList: []
  }
  public componentWillMount () {
    if (this.props.type === 'customer') {
      fetchRegion({
        level: 2
      }).then((res: Common.RegionProps[]) => {
        this.setState({
          cityList: res
        })
      })
    }
    if (this.props.reset) {
      APP.dispatch({
        type: 'change customer data',
        payload: {
          detail: {
            contactPersons: [{
              contactPerson: '',
              contactPhone: ''
            }]
          },
          linkMan: [{
            contactPerson: '',
            contactPhone: ''
          }]
        }
      })
    }
    if (this.props.customerId) {
      changeCustomerDetailAction(this.props.customerId)
    }
    // 客资管理查看详情的时候 选择城市默认请求当前城市的地区
    // if (this.props.type === 'customer' && this.props.customerId && this.props.cityCode) {
    //   const cityCode = this.props.cityCode
    //   fetchRegion({
    //     parentId: cityCode,
    //     level: 3
    //   }).then((res) => {
    //     this.setState({
    //       areaList: res
    //     })
    //   })
    // }
    // 公害用到
    if (this.props.type !== 'customer') {
      const cityCode = APP.user.cityCode || '110100'
      fetchRegion({
        parentId: cityCode, // 登陆的客户城市对应的地区
        level: 3
      }).then((res: Common.RegionProps[]) => {
        this.setState({
          areaList: res
        })
      })
    }
  }
  public editLinkMan () {
    if (this.props.type === 'open') {
      return false
    }
    const modal = new Modal({
      header: (
        <div>
          <div className='fl font14'>联系人</div>
          <b className='fr'>
            <AddButton
              onClick={this.addLinkMan.bind(this)}
            />
          </b>
        </div>
      ),
      content: (
        <Provider>
          <LinkMain
            onOk={(data) => {
              const detail = this.props.detail
              detail.contactPersons = data
              APP.dispatch<Customer.Props>({
                type: 'change customer data',
                payload: {
                  detail
                }
              })
              this.props.form.setFieldsValue({
                'linkMan[0].contactPerson': data[0].contactPerson,
                'linkMan[0].contactPhone': data[0].contactPhone
              })
              modal.hide()
            }}
            onCancel={() => {
              modal.hide()
            }}
          />
        </Provider>
      ),
      footer: null
    })
    APP.dispatch<Customer.Props>({
      type: 'change customer data',
      payload: {
        linkMan: this.props.detail.contactPersons
      }
    })
    modal.show()
  }
  public addLinkMan () {
    const data = this.props.linkMan
    data.push({
      contactPerson: '',
      contactPhone: ''
    })
    APP.dispatch({
      type: 'change customer data',
      payload: {
        linkMan: data
      }
    })
  }
  public handleChange (e: React.SyntheticEvent, value: {key: string, value: any}) {
    if (/linkMan\[0\]/.test(value.key)) {
      const linkMan: any = this.props.linkMan
      const field = value.key.replace('linkMan[0].', '')
      linkMan[0][field] = value.value
      console.log(linkMan, 'linkMan')
      APP.dispatch({
        type: 'change customer data',
        payload: {
          linkMan
        }
      })
    } else {
      const detail: any = this.props.detail
      _.set(detail, value.key, value.value)
      APP.dispatch({
        type: 'change customer data',
        payload: {
          detail
        }
      })
    }
  }
  public getSelectValue (field: string, arr: Array<{label: string, value: string}>) {
    const detail: any = this.props.detail
    const value = detail[field]
    const res = arr.find((item) => {
      if (String(item.value) === String(value)) {
        return true
      }
    })
    if (res) {
      return res.label
    } else {
      return ''
    }
  }
  public save () {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errs: any, values: any) => {
        if (errs) {
          return
        }
        this.linkman.props.form.validateFields((errs2: any) => {
          if (errs2) {
            reject()
          } else {
            const params = this.props.detail
            if (this.props.type === 'customer' && !params.cityCode) {
              APP.error('请选择城市！')
              return
            }
            params.customerNameType = '1' // 后端不需要改代码所以加上
            const person = _.cloneDeep(this.props.linkMan)
            person.forEach((item) => {
              delete item.key
              delete item.canCall
            })
            APP.dispatch<Customer.Props>({
              type: 'change customer data',
              payload: {
                linkMan: person
              }
            })
            params.contactPersons = person
            if (this.props.detail.id) {
              updateCustomer(this.props.detail.id, params).then(() => {
                resolve()
              }, () => {
                reject()
              })
            } else {
              if (this.props.type === 'business') { // 商机新增接口
                addBusinessCustomer(params).then((res) => {
                  resolve(res)
                }, () => {
                  reject()
                })
              } else {
                addCustomer(params).then(() => { // 客资新增接口
                  resolve()
                }, () => {
                  reject()
                })
              }
            }
          }
        })
      })
    })
  }
  public handleCityChange (value: {key: string, title: string}) {
    if (value.key === undefined) {
      return
    }
    this.handleChange(null, {
      key: 'cityCode',
      value: value.key
    })
    const detail = this.props.detail
    // detail.areaName = ''
    detail.cityName = value.title
    APP.dispatch({
      type: 'change customer data',
      payload: {
        detail
      }
    })
    // fetchRegion({
    //   parentId: value.key,
    //   level: 3
    // }).then((res) => {
    //   this.setState({
    //     areaList: res
    //   })
    // })
  }
  public handleAreaChange (value: {key: string, title: string}) {
    if (value.key === undefined) {
      return
    }
    this.handleChange(null, {
      key: 'areaCode',
      value: value.key
    })
    const detail = this.props.detail
    detail.areaName = value.title
    APP.dispatch({
      type: 'change customer data',
      payload: {
        detail
      }
    })
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const { track } = this.props
    const disabled = this.props.type === 'open' || track
    console.log('12345678', track)
    const detail = this.props.detail
    return (
      <Form className={styles['base-info']}>
        {
          this.props.customerId &&
          <Row gutter={8}>
            <Col span={24}>
              <FormItem
              >
                {getFieldDecorator(
                  'customerName',
                  {
                    rules: [
                      {
                        required: true,
                        message: '公司名不能为空'
                      }
                    ],
                    initialValue: this.props.detail.customerName,
                    valuePropName: this.props.detail.customerName
                  }
                )(
                  <FormItemLayout
                    label='公司名称'
                    required
                  >
                    <CompanySearch
                      disabled={disabled}
                      value={detail.customerName}
                      onSelectCompany={(item) => {
                        this.handleChange(null, {
                          key: 'customerName',
                          value: item.name
                        })
                        this.handleChange(null, {
                          key: 'isConfirmed',
                          value: 1
                        })
                      }}
                      onChange={(e) => {
                        this.handleChange(null, {
                          key: 'isConfirmed',
                          value: 0
                        })
                        this.handleChange(null, {
                          key: 'customerName',
                          value: e.target.value || undefined
                        })
                        this.props.form.setFieldsValue({
                          customerName: e.target.value || undefined
                        })
                      }}
                    />
                  </FormItemLayout>
                  // <Input
                  //   required
                  //   label={'公司名'}
                  //   field='customerName'
                  //   onChange={this.handleChange.bind(this)}
                  //   value={this.props.detail.customerName}
                  //   disabled={disabled}
                  // />
                )}
              </FormItem>
            </Col>
          </Row>
        }
        {
          !this.props.customerId &&
          <Row gutter={8}>
            <Col span={12}>
              <FormItem
              >
                {getFieldDecorator(
                  'customerName',
                  {
                    rules: [
                      {
                        required: true,
                        message: '公司名不能为空'
                      }
                    ],
                    initialValue: this.props.detail.customerName,
                    valuePropName: this.props.detail.customerName
                  }
                )(
                  <FormItemLayout
                    label='公司名称'
                    required
                  >
                    <CompanySearch
                      disabled={disabled}
                      value={detail.customerName}
                      onSelectCompany={(item) => {
                        this.handleChange(null, {
                          key: 'customerName',
                          value: item.name
                        })
                        this.handleChange(null, {
                          key: 'isConfirmed',
                          value: 1
                        })
                      }}
                      onChange={(e) => {
                        this.handleChange(null, {
                          key: 'isConfirmed',
                          value: 0
                        })
                        this.handleChange(null, {
                          key: 'customerName',
                          value: e.target.value || undefined
                        })
                        this.props.form.setFieldsValue({
                          customerName: e.target.value || undefined
                        })
                      }}
                    />
                  </FormItemLayout>
                  // <Input
                  //   required
                  //   label={'公司名'}
                  //   field='customerName'
                  //   onChange={this.handleChange.bind(this)}
                  //   value={this.props.detail.customerName}
                  //   disabled={disabled}
                  // />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator(
                  'customerSource',
                  {
                    rules: [
                      {
                        required: true,
                        message: '客户来源不能为空'
                      }
                    ],
                    initialValue: this.props.detail.customerSource,
                    valuePropName: this.props.detail.customerSource
                  }
                )(
                  <FormItemLayout
                    label='客户来源'
                    required
                  >
                    <Select
                      style={{width: '100%'}}
                      disabled={disabled}
                      value={this.getSelectValue('customerSource', APP.keys.EnumCustomerSource)}
                      onChange={(value) => {
                        this.handleChange(null, {
                          key: 'customerSource',
                          value
                        })
                        this.props.form.setFieldsValue({
                          customerSource: value
                        })
                      }}
                    >
                      {
                        APP.keys.EnumCustomerOfflineSource.map((item) => {
                          return (
                            <Option
                              key={item.value}
                            >
                              {item.label}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </FormItemLayout>
                )}
              </FormItem>
            </Col>
          </Row>
        }
        <Row gutter={8} className='mt10' >
          <Col>
            <LinkMan
              disabled={disabled}
              showTel={this.props.showTel}
              getInstance={(ref) => {
                console.log(ref)
                this.linkman = ref
              }}
            />
          </Col>
        </Row>
        <Row gutter={8} className='mt10'>
          <Col span={12}>
            <FormItemLayout
              label='纳税类别'
            >
              <Select
                style={{width: '100%'}}
                disabled={disabled}
                value={detail.payTaxesNature ? detail.payTaxesNature + '' : ''}
                onChange={(value) => {
                  this.handleChange(null, {
                    key: 'payTaxesNature',
                    value
                  })
                }}
              >
                {
                  APP.keys.EnumPayTaxesNature.map((item) => {
                    return (
                      <Option
                        key={item.value}
                      >
                        {item.label}
                      </Option>
                    )
                  })
                }
              </Select>
            </FormItemLayout>
          </Col>
          {
            this.props.type !== 'customer' &&
            <Col span={12}>
              <FormItemLayout
                label='注册时间'
              >
                <DatePicker
                  placeholder=''
                  disabled={disabled}
                  value={detail.registerTime ? moment(detail.registerTime) : undefined}
                  onChange={(value) => {
                    const val = value.format('YYYY-MM-DD')
                    this.handleChange(null, {
                      key: 'registerTime',
                      value: val
                    })
                  }}
                />
              </FormItemLayout>
            </Col>
          }
          {/* {
            this.props.type !== 'customer' &&
            <Col span={12}>
              <FormItemLayout
                label='地区'
              >
                <AutoComplete
                  className={styles['auto-complete']}
                  disabled={disabled}
                  defaultValue={{
                    name: detail.areaName || ''
                  }}
                  data={this.state.areaList}
                  onChange={this.handleAreaChange.bind(this)}
                  setFields={{
                    title: 'name',
                    key: 'code'
                  }}
                />
              </FormItemLayout>
            </Col>
          } */}
          {
            (this.props.type === 'customer' && !this.props.customerId) &&
            <Col span={12}>
              <FormItem>
                {getFieldDecorator(
                  'sourcePlatform'
                )(
                  <FormItemLayout
                    label='来源平台'
                  >
                    <Select
                      style={{width: '100%'}}
                      value={this.getSelectValue('sourcePlatform', APP.keys.SourcePlatformEnum)}
                      onChange={(value) => {
                        this.handleChange(null, {
                          key: 'sourcePlatform',
                          value
                        })
                        this.props.form.setFieldsValue({
                          sourcePlatform: value
                        })
                      }}
                    >
                      {
                        APP.keys.SourcePlatformEnum.map((item) => {
                          return (
                            <Option
                              key={item.value}
                            >
                              {item.label}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </FormItemLayout>
                )}
              </FormItem>
            </Col>
          }
        </Row>
        {
          this.props.type === 'customer' &&
          <Row gutter={8} className='mt10'>
            <Col span={12}>
              <FormItemLayout
                label='城市'
                required
              >
                <AutoComplete
                  className={styles['auto-complete']}
                  data={this.state.cityList}
                  defaultValue={{
                    name: detail.cityName || ''
                  }}
                  onChange={this.handleCityChange.bind(this)}
                  setFields={{
                    title: 'name',
                    key: 'code'
                  }}
                />
              </FormItemLayout>
            </Col>
            <Col span={12}>
              <FormItemLayout
                label='注册时间'
              >
                <DatePicker
                  placeholder=''
                  disabled={disabled}
                  value={detail.registerTime ? moment(detail.registerTime) : undefined}
                  onChange={(value) => {
                    const val = value.format('YYYY-MM-DD')
                    this.handleChange(null, {
                      key: 'registerTime',
                      value: val
                    })
                  }}
                />
              </FormItemLayout>
            </Col>
            {/* <Col span={12}>
              <FormItemLayout
                label='地区'
              >
                <AutoComplete
                  className={styles['auto-complete']}
                  disabled={disabled}
                  defaultValue={{
                    name: detail.areaName
                  }}
                  data={this.state.areaList}
                  onChange={this.handleAreaChange.bind(this)}
                  setFields={{
                    title: 'name',
                    key: 'code'
                  }}
                />
              </FormItemLayout>
            </Col> */}
          </Row>
        }
        <Row gutter={8} className='mt10'>
          <Col span={24} className={styles['form-item-1']}>
            <Input
              maxlength='100'
              field='address'
              onChange={this.handleChange.bind(this)}
              label={'公司地址'}
              value={this.props.detail.address}
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row gutter={8} className='mt10'>
          <Col span={24} className={styles['form-item-1']}>
            <TextArea
              field='remark'
              onChange={this.handleChange.bind(this)}
              label={'备注'}
              value={this.props.detail.remark}
              disabled={disabled}
            />
          </Col>
        </Row>
        {/* {
          this.props.customerId &&
          <Row gutter={8} className='mt10'>
            <Col span={24}>
              <TextArea
                field='relatedCompany'
                label={'相关公司'}
                value={this.props.detail.relatedCompany}
                disabled={true}
              />
            </Col>
          </Row>
        } */}
      </Form>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
}, null, null, {
  withRef: true
})(Form.create({ withRef: true })(Main))
