import React from 'react'
import { Modal, Form, Input, Checkbox, Button, Select } from 'antd'

const styles = require('./index.styl')
const Option = Select.Option
const FormItem = Form.Item

interface Props {
  title?: '添加账号' | '查看账号' | '修改账号' // 标题
  onOk?: () => void // 确认回调
  onCancle?: () => void // 取消回调
  form?: any
}

const validation = {
  name: {
    validateTrigger: 'onBlur',
    rules:[
      {required: true, message: '请输入姓名！'}
    ]
  },
  phone: {
    validateTrigger: 'onBlur',
    rules:[
      {required: true, message: '请输入手机号！'},
      {len: 11, message: '手机号格式不对！'}
    ]
  },
  email: {
    validateTrigger: 'onBlur',
    rules:[
      {required: true, message: '请输入邮箱！'},
      {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式不正确！'}
    ]
  },
  department: {
    rules:[
      {required: true, message: '请选择部门！'}
    ]
  },
  role: {
    rules:[
      {required: true, message: '请选择角色！'}
    ]
  }
}

class Main extends React.Component<any, any> {

  public state = {
    isShow: false // 弹窗是否显示
  }

  // 点击确认按钮
  public clickSure = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (err) {return}
      console.log(values)
    })
  }

  // 隐藏弹窗
  public hide = () => {
    this.setState({isShow: false})
  }

  public render () {
    const {title, onOk, onCancle, form:{getFieldDecorator}} = this.props
    return (
      <Modal
        className={styles.modal}
        title={title || '添加账号'}
        visible={this.state.isShow}
        cancelText='取消'
        okText='确定'
        onOk={this.clickSure}
        onCancel={this.hide}
      >

        <Form>

          <FormItem className={styles.item} colon wrapperCol={{span: 10}} labelCol={{span: 4}} label='姓名'>
            {
              getFieldDecorator('name', validation.name)(
                <Input placeholder='请输入姓名'/>
              )
            }
          </FormItem>

          <FormItem className={styles.item} colon wrapperCol={{span: 10}} labelCol={{span: 4}} label='手机号'>
            {
              getFieldDecorator('phone', validation.phone)(
                <Input placeholder='请输入手机号'/>
              )
            }
          </FormItem>

          <FormItem className={styles.item} colon wrapperCol={{span: 10}} labelCol={{span: 4}} label='邮箱'>
            {
              getFieldDecorator('email', validation.email)(
                <Input placeholder='请输入邮箱'/>
              )
            }
          </FormItem>

          <FormItem className={styles.item} colon wrapperCol={{span: 10}} labelCol={{span: 4}} label='部门'>
            {
              getFieldDecorator('department', validation.department)(
                <Select placeholder='请选择部门' notFoundContent='暂无数据' defaultValue='1'>
                  <Option value='1'>11</Option>
                  <Option value='2'>22</Option>
                  <Option value='3'>33</Option>
                </Select>
              )
            }
          </FormItem>

          <FormItem className={styles.item} colon wrapperCol={{span: 10}} labelCol={{span: 4}} label='角色'>
            {
              getFieldDecorator('role', validation.role)(
                <Select placeholder='请选择角色' notFoundContent='暂无数据'>
                  <Option key='1'>11</Option>
                  <Option key='2'>22</Option>
                  <Option key='3'>33</Option>
                </Select>
              )
            }
          </FormItem>

          <FormItem className={styles.item} colon wrapperCol={{span: 13}} labelCol={{span: 4}} label='负责区域' >
            <Input/>
            <Button className={styles.btn} style={{float: 'right'}}>添加区域</Button>
          </FormItem>

        </Form>

        <div className={styles.permission}>
          <b>所属权限：</b>
          <Checkbox disabled>渠道用户</Checkbox><br/>
          <Checkbox disabled>直营用户</Checkbox><br/>
          <Checkbox disabled>直营用户</Checkbox><br/>
          <Checkbox disabled>直营用户</Checkbox><br/>
        </div>

      </Modal>
    )
  }
}

export default Form.create()(Main)
