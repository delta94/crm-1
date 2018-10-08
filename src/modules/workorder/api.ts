/**
 * 工单
 */
import http from '@/utils/http'
class Service {
  /*
    工单列表
    pageCurrent=当前页码
    pageSize=每页显示条数
    param=订单编号
    startDate=开始时间
    endDate=结束时间
    name=服务内容
    status=服务中
  */
  public getWorkOrderList (
    pageCurrent: any = '',
    pageSize: any = '',
    param: any = '',
    startDate: any = '',
    endDate: any = '',
    name: any = '',
    status: any = '') {
    return http(
      `/work/v1/api/order/list?pageCurrent=${pageCurrent}&pageSize=${pageSize}&param=${param}&` +
      `startDate=${startDate}&` +
      `endDate=${endDate}&` +
      `name=${name}&` +
      `status=${status}`
    )
  }
  /*
    工单详情
  */
  public getOrderDetail (id: any = '') {
    return http(
    `/work/v1/api/order/${id}`
   )
  }
  /*
    工单详情人员信息
  */
  public getUserDetail (id: any = '') {
    return http(
    `user/v1/api/user/${id}`
  )
  }
}

export default new Service()