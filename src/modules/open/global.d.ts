declare namespace Open {
  export interface DetailProps {
    customerName?: string
    contactPerson?: string
    contactPhone?: string
    intention?: string
    telephoneStatus?: string
    freeDays?: string
    customerSource?: string
    createBeginDate?: string
    releaseNums?: string
    lastReleaseSalesperson?: string
    lastReleaseTime?: string
    id?: string
    /* 最后跟进时间 */
    lastTrackTime?: string
    /** 支付中状态 */
    payStatus?: number
  }
  export interface SearchProps {
    lastReleaseTimeBegin?: string
    lastReleaseTimeEnd?: string
    createBeginDate?: string
    createEndDate?: string
    pageSize?: number
    pageCurrent?: number
    telephoneStatus?: string
    intention?: string
    customerName?: string
    contactPerson?: string
    contactPhone?: string
    customerSource?: string
    lastReleaseSalesperson?: string
    busSeaMemo?: string
    payTaxesNature?: string
    lastTrackTimeEnd?: string
    lastTrackTimeBegin?: string
    [field: string]: any
  }
}
