declare namespace OutSite {
  /** 商品属性 */
  export interface GoodProps {
    code: string
    id: string
    name: string
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
  }
  export type Map<T> = {[index: string]: T}
  /** 任务类型 */
  export interface TaskItem {
    id?: number
    name?: string
    productId?: number
    productName?: string
    subList?: SubTaskItem[]
    /** 是否优先级 */
    priority?: number
    status?: string
    systemFlag?: '0' | '1' | '-1'
    [field: string]: any
  }
  /** 子任务类型 */
  export interface SubTaskItem {
    id?: number
    name?: string
    subId?: number
    sort?: number
  }
  /** 领用详情搜索条件 */
  export interface ReceivePayload {
    pageCurrent: number
    pageSize: number
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
}