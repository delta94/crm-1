import React from 'react'
import { Input, Row, Col, Form } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import FormItemLayout from '@/components/form/Item1'
import { connect } from 'react-redux'
import Call from './ToCall'
const styles = require('./style')
const FormItem = Form.Item
interface Props extends Customer.Props, FormComponentProps {
  getInstance?: (ins: any) => void
  showTel?: boolean
  disabled?: boolean
}
class Main extends React.Component<Props> {
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  public componentWillReceiveProps (props: Props) {
    if (this.props.detail.id !== props.detail.id) {
      this.props.form.resetFields()
    }
  }
  public onChange (field: string, value: string, index: number) {
    const linkMan: any[] = this.props.linkMan
    linkMan[index][field] = value
    console.log(linkMan, 'onChangelinkMan')
    APP.dispatch<Customer.Props>({
      type: 'change customer data',
      payload: {
        linkMan
      }
    })
  }
  public getLinkMan (disabled: boolean) {
    const linkMan = this.props.linkMan
    if (disabled) {
      return linkMan
    }
    if (linkMan.length < 2) {
      for (let i = 0; i < 2 - linkMan.length; i++) {
        linkMan.push({
          contactPerson: '',
          contactPhone: ''
        })
      }
    }
    linkMan.forEach((item) => {
      if (!item.canCall) {
        item.canCall = '1'
      }
    })
    return linkMan
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const disabled = this.props.disabled === undefined ? false : this.props.disabled
    const linkMan = this.getLinkMan(disabled)
    console.log(linkMan, '1211212')
    return (
      <FormItemLayout
        required
        label='主联系人'
        labelStyle={{
          verticalAlign: 'top',
          lineHeight: '32px'
        }}
      >
        <Form className={styles.container}>
          {
            linkMan.map((item, index) => {
              return (
                <Row
                  gutter={8}
                  key={item.key}
                >
                  <Col span={12}>
                    {
                      (index > 0 && !disabled) && <div
                        className={styles.operate}
                      >
                        {
                          index === 1 && <div
                            className={styles.add}
                            onClick={() => {
                              linkMan.push({
                                contactPerson: '',
                                contactPhone: ''
                              })
                              APP.dispatch<Customer.Props>({
                                type: 'change customer data',
                                payload: {
                                  linkMan
                                }
                              })
                            }}
                          >
                            +
                          </div>
                        }
                        {
                          index > 1 && <div
                            className={styles.delete}
                            onClick={() => {
                              linkMan.splice(index, 1)
                              APP.dispatch<Customer.Props>({
                                type: 'change customer data',
                                payload: {
                                  linkMan
                                }
                              })
                            }}
                          >
                            -
                          </div>
                        }
                      </div>
                    }
                    <FormItem>
                      {getFieldDecorator(
                        `person-${item.key}`,
                        {
                          initialValue: item.contactPerson,
                          rules: index === 0 ? [
                            {
                              required: true,
                              message: '联系人不能为空'
                            }
                          ] : []
                        }
                      )(
                        <Input
                          disabled={disabled}
                          placeholder='请输入联系人'
                          onChange={(e) => {
                            this.onChange('contactPerson', e.target.value, index)
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem>
                      {
                        getFieldDecorator(
                          `phone-${item.key}`,
                          {
                            initialValue: item.contactPhone,
                            rules: index === 0 ? [
                              {
                                required: true,
                                message: '联系电话不能为空'
                              }
                            ] : []
                          }
                        )(
                          <Input
                            // type='number'
                            disabled={disabled}
                            maxLength={13}
                            placeholder='请输入联系电话'
                            onChange={(e) => {
                              const value = e.target.value
                              console.log(value, 'value1212121')
                              e.target.value = value.replace(/[^\d]/g, '')
                              this.onChange('contactPhone', e.target.value, index)
                              // 如果电话修改 但是没有保存 不允许打电话 给提示
                              this.onChange('canCall', '0', index)
                            }}
                          />
                        )
                      }
                    </FormItem>
                  </Col>
                  {this.props.showTel && (
                    <Call
                      style={{
                        position: 'absolute',
                        right: '-18px',
                        top: '9px'
                      }}
                      canCall={item.canCall === '1' ? true : false}
                      phone={item.contactPhone}
                      name={item.contactPerson}
                      detail={this.props.detail}
                    />
                  )}
                </Row>
              )
            })
          }
        </Form>
      </FormItemLayout>
    )
  }
}
export default connect((state: Reducer.State) => {
  return state.customer
})(Form.create()(Main))
