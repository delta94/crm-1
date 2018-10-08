import React from 'react'
import { Row, Col, Icon, Button, Select, Form } from 'antd'
import DropDown from 'pilipa/libs/dropdown'
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
import { addCustomer, updateCustomer } from './api'
import { fetchRegion } from '@/modules/common/api'
const styles = require('./style')
const Option = Select.Option
const FormItem = Form.Item
interface Props extends Customer.Props, FormComponentProps {
  customerId?: string
  isBussiness?: boolean
  onClose?: () => void
  flowNow?: () => void
  reset?: boolean
}
interface State {
  cityName: string
  cityList: Common.RegionProps[]
  areaName: string
  areaList: Common.RegionProps[]
}
class Main extends React.Component<Props> {
  public state: State = {
    cityName: '',
    areaName: '',
    cityList: [],
    areaList: []
  }
  public componentWillMount () {
    fetchRegion().then((res) => {
      this.setState({
        cityList: res
      })
    })
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
  }
  public editLinkMan () {
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
      onOk: () => {
        console.log(this.props.linkMan, 'linkMan')
        modal.hide()
      },
      content: <Provider><LinkMain /></Provider>
    })
    modal.show()
  }
  public addLinkMan () {
    const data = this.props.linkMan
    data.push({
      contactPerson: '',
      contactPhone: ''
      // customerSource: '',
      // mark: '',
      // worker: ''
    })
    console.log(data, 'data')
    APP.dispatch({
      type: 'change customer data',
      payload: {
        linkMan: data
      }
    })
  }
  public handleChange (e: React.SyntheticEvent, value: {key: string, value: any}) {
    console.log(value)
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
      return arr.length > 0 ? arr[0].label : ''
    }
  }
  public save () {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errs: any, values: any) => {
        if (errs) {
          return
        }
        const params = this.props.detail
        params.customerNameType = '1' // 后端不需要改代码所以加上
        params.isConfirmed = '1' // 是否天眼查
        params.contactPersons = this.props.linkMan
        // params.contactPersons = [{ contactPerson: '11', contactPhone: '122', isMainContact: '1'}]
        if (this.props.customerId) {
          updateCustomer(this.props.customerId, params).then(() => {
            resolve()
          }, () => {
            reject()
          })
        } else {
          addCustomer(params).then(() => {
            resolve()
          }, () => {
            reject()
          })
        }
      })
    })
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    console.log(this.props.detail, 'render')
    return (
      <Form className={styles['base-info']}>
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
                  ]
                }
              )(
                <Input
                  required
                  label={'公司名'}
                  field='customerName'
                  onChange={this.handleChange.bind(this)}
                  value={this.props.detail.customerName}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
          <FormItem
            >
              {getFieldDecorator(
                'customerSource'
              )(
                <FormItemLayout
                  label='客户来源'
                  required
                >
                  <Select
                    style={{width: '100%'}}
                    value={this.getSelectValue('customerSource', APP.keys.EnumCustomerSource)}
                    onChange={(value) => {
                      this.props.form.validateFields(() => {
                        console.log('validataor')
                      })
                      this.handleChange(null, {
                        key: 'customerSource',
                        value
                      })
                    }}
                  >
                    {
                      APP.keys.EnumCustomerSource.map((item) => {
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
        <Row gutter={8} className='mt10' >
          <Col span={12}>
            <FormItem
            >
              {getFieldDecorator(
                'linkMan[0].contactPerson',
                {
                  valuePropName: this.props.linkMan[0].contactPerson,
                  rules: [
                    {
                      required: true,
                      message: '主联系人不能为空'
                    }
                  ]
                }
              )(
                <Input
                  required
                  label={'主联系人'}
                  field='linkMan[0].contactPerson'
                  addonAfter={
                    (
                      <Icon
                        onClick={this.editLinkMan.bind(this)}
                        style={{cursor: 'pointer'}}
                        type='ellipsis'
                        theme='outlined'
                      />
                    )
                  }
                  onChange={this.handleChange.bind(this)}
                  value={this.props.linkMan[0].contactPerson}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem>
              {getFieldDecorator(
                'linkMan[0].contactPhone',
                {
                  valuePropName: this.props.linkMan[0].contactPhone,
                  rules: [
                    {
                      required: true,
                      message: '主联系电话不能为空'
                    }
                  ]
                }
              )(
                <Input
                  required
                  label='主联系电话'
                  field='contactPersons[0].contactPhone'
                  onChange={this.handleChange.bind(this)}
                  value={this.props.linkMan[0].contactPhone}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8} className='mt10'>
          <Col span={12}>
            <Input
              field='legalPerson'
              label='法人'
              onChange={this.handleChange.bind(this)}
              value={this.props.detail.legalPerson}
            />
          </Col>
          <Col span={12}>
            <FormItemLayout
              label='纳税类别'
            >
              <Select
                style={{width: '150px'}}
                // defaultValue={}
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
        </Row>
        <Row gutter={8} className='mt10'>
          {
            !this.props.isBussiness &&
            <Col span={12}>
              <FormItemLayout
                label='城市'
              >
                <DropDown
                  data={this.state.cityList}
                  title={this.state.cityName}
                  onChange={(value) => {
                    this.handleChange(null, {
                      key: 'cityCode',
                      value: value.key
                    })
                    this.setState({
                      areaName: '',
                      cityName: value.title
                    })
                    fetchRegion({
                      parentId: value.key,
                      level: 2
                    }).then((res) => {
                      this.setState({
                        areaList: res
                      })
                    })
                  }}
                  setFields={{
                    title: 'name',
                    key: 'code'
                  }}
                />
              </FormItemLayout>
            </Col>
          }
          <Col span={12}>
              <FormItemLayout
                label='地区'
              >
                <DropDown
                  title={this.state.areaName}
                  data={this.state.areaList}
                  onChange={(value) => {
                    this.handleChange(null, {
                      key: 'areaCode',
                      value: value.key
                    })
                    this.setState({
                      areaName: value.title
                    })
                  }}
                  setFields={{
                    title: 'name',
                    key: 'code'
                  }}
                />
              </FormItemLayout>
          </Col>
        </Row>
        <Row gutter={8} className='mt10'>
          <Col span={24}>
            <Input
              field='address'
              onChange={this.handleChange.bind(this)}
              label={'公司地址'}
              value={this.props.detail.address}
            />
          </Col>
        </Row>
        <Row gutter={8} className='mt10'>
          <Col span={24}>
            <TextArea
              field='remark'
              onChange={this.handleChange.bind(this)}
              label={'备注'}
              value={this.props.detail.remark}
            />
          </Col>
        </Row>
        {/* <div className='text-right mt10'>
          <Button
            className='mr5'
            type='primary'
            onClick={this.save.bind(this)}
          >
            保存
          </Button>
          {
            this.props.isBussiness &&
            <Button
              type='primary'
              onClick={() => {
                this.props.flowNow()
              }}
            >
              现在跟进
            </Button>
          }
        </div> */}
      </Form>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
}, null, null, {
  withRef: true
})(Form.create({ withRef: true })(Main))
