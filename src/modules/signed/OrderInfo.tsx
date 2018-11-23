import React from 'react'
import { Row, Col, Tooltip, Icon } from 'antd'
import Modal from 'pilipa/libs/modal'
import classNames from 'classnames'
import { fetchOrders } from './api'
const styles = require('./style')
interface Props {
  customerId: string
}
interface States {
  length: any[]
  number: any[]
  OrderData: Array<{
    orderCode: string
    createTime: string
    salerName: string
    status: number
    startDate: string
    endDate: string
    amount: number
    remark: string
    products?: Array<{
      productName: string
      quantity: number
      productSalePrice: string
    }>
  }>
}
class Main extends React.Component<Props> {
  public state: States = {
    length: [],
    number: [],
    OrderData: []
  }
  public componentDidMount () {
    fetchOrders(this.props.customerId).then((res) => {
      this.setState({
        OrderData: res.data.records
      },()=>{
        const {OrderData}=this.state
        let len: any=[]
        let num: any=[]
        OrderData.map((value,index)=>{
             len.push(Math.ceil(value.products.length/4));
             num.push(1)         
        })
        this.setState({
          length:len,
          number:num
        })
      })
    })
  }

  // componentDidMount(){
  //   const {OrderData}=this.state
  //   let len: any=[]
  //   let num: any=[]
  //   OrderData.map((value,index)=>{
  //        len.push(Math.ceil(value.products.length/4));
  //        num.push(1)
              
  //   })
  //   this.setState({
  //     length:len,
  //     number:num
  //   })
  // }
  
  public render () {
    const {number,length} = this.state

    return (
      <div>
        {
          this.state.OrderData.map((item, index) => {
            return (
              <div className={classNames(styles.order, 'clear')} key={index}>
                <div className={classNames(styles['order-info'])}>
                  <div className={classNames(styles.col, styles.note)}>
                    <Tooltip placement='top' title={item.remark}>
                      注
                    </Tooltip>
                  </div>
                  <div className={styles.col}>
                    <label>订单号：</label>
                    <span>{item.orderCode}</span>
                  </div>
                  <div className={styles.col}>
                    <label>签单时间：</label>
                    <span>{item.createTime}</span>
                  </div>
                  <div className={styles.col}>
                    <label>签单人：</label>
                    <span>{item.salerName}</span>
                  </div>
                  <div className={styles.col}>
                    <label>状态：</label>
                    <span>{item.status}</span>
                  </div>
                  <div className={styles.col}>
                    <label>服务账期：</label>
                    <span>{item.startDate}-{item.endDate}</span>
                  </div>
                </div>
                <div className={styles.marg}>
                  <div 
                    className={styles.left}
                    onClick={() => {
                      let i=number[index]-1
                      if(i<=0){
                        i=length[index]
                      }
                      number[index]=i
                      this.setState({
                        number
                      })
                  }}>
                    <Icon type='left' theme='outlined' />
                  </div>
                  <div className={styles['order-con']}>
                    {
                      item.products.filter((children, index1) => {return index1>((number[index]-1)*4) && index1<=(number[index]*4)}).map((children, index1) => {
                        // this.state.length = Math.ceil(index1/4)
                        return (
                          <div className={styles.con} key={index1}>
                            <div>{children.productName}*{children.quantity}</div>
                            <div>
                              <span className={classNames(styles.small, styles.black)}>¥</span>
                              <span className={classNames(styles.big, styles.black)}>{children.productSalePrice}</span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div 
                    className={styles.right}
                    onClick={() => {
                      let i=number[index]+1
                      if(i>length){
                        i=1
                      }
                      number[index]=i
                      this.setState({
                        number
                      })
                    }}>
                    <Icon type='right' theme='outlined'/>
                  </div>
                </div>
                <div className={styles['order-bottom']}>
                  <div className={styles.col}>
                    <span>共{item.products.length}个服务</span>
                  </div>
                  <div className={styles.col}>
                    <label>订单金额：</label>
                    <span>{item.amount}</span>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
export default Main
