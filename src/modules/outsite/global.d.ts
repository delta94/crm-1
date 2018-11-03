declare namespace OutSide {
  export interface SearchPayload {
    pageCurrent?: number
    pageSize?: number
    customerName?: string
    name?: string
    status?: string
    templateId?: number
    subTemplateId?: number
    userId?: number
    userName?: string
    areaId?: string
    fromTime?: string
    toTime?: string
    orgId?: number
    statusArray?: string
  }
  /** 商品属性 */
  export interface GoodProps {
    code: string
    id: string
    name: string
    money: number
  }
  /** 外勤人员 */
  export interface OutSiterProps {
    id: number
    identity: string
    name: string
    userType: string
  }
  export interface OrderProps {
    /** 城市code */
    cityCode: string
    cityName: string
    /** 区县code */
    countyCode: string
    /** 区县名称 */
    countyName: string
    /** 客户id */
    customerOrgId: string
    /** 客户名 */
    customerOrgName: string
    /** 订单号 */
    orderCode: string
    /** 销售名称 */
    salerName: string
    /** 联系人名称 */
    customerName: string
    /** 联系人电话 */
    customerPhone: string
    /** 销售ID */
    salerId: string
  }
  export type Map<T = any> = {[index: string]: T}
  /** 任务类型 */
  export interface TaskItem {
    id?: any
    name?: string
    productId?: number
    productName?: string
    subList?: SubTaskItem[]
    /** 是否优先级 */
    priority?: any
    status?: string
    systemFlag?: '0' | '1' | '-1'
    customerId?: any
    customerName?: string
    areaId?: any
    areaName?: string
    orderNo?: string
    [field: string]: any
  }
  /** 子任务类型 */
  export interface SubTaskItem {
    id?: any
    name?: string
    userName?: string
    subId?: number
    sort?: number
    status?: string
    category?: string
    customerName?: string
    contacter?: string
    subList?: SubTaskItem[]
    areaName?: string
    startTime?: string
    endTime?: string
    cancelReason?: string
    imageUrl?: any
  }
  /** 领用详情搜索条件 */
  export interface ReceivePayload {
    pageCurrent: number
    pageSize: number
    taskId: any
  }
  /** 领用详情item */
  export interface ReceiveItemProps {
    id: number
    taskName: string
    taskType: string
    charge: number
    /** 开户行 */
    bankName: string
    /** 卡号 */
    bankNo: string
    /** 领用单状态 */
    requestStatus: string
    taskId: string
    /** 子任务id */
    subTaskId: string
    /** 发起人 */
    initiator: string
    /** 发起人机构 */
    initiatorAgent: string
  }
  export interface Props {
    config: {
      common: {
        tab: '1' | '2'
      }
    }
  }
}