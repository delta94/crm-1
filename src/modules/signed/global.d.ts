declare namespace Signed {
  export interface DetailProps {
    id?: string
    customerName?: string
    contactPerson?: string
    area?: string
    currentSalesperson?: string
    operatingAccouting?: string
    createTime?: string
    EndTime?: string
    startTime?: string
  }
  export interface SearchProps {
    storageBeginDate?: string
    storageEndDate?: string
    createBeginDate?: string
    createEndDate?: string
    pageSize?: number
    pageCurrent?: number
    telephoneStatus?: string
    intention?: string
    customerName?: string
    areaName?: string
    contactPerson?: string
    contactPhone?: string
    customerSource?: string
    operatingAccouting?: string
    signSalesperson?: string
    currentSalesperson?: string
    contractCode?: string
    payTaxesNature?: string
    serviceExpireBeginMonth?: string
    serviceExpireEndMonth?: string
  }
}
