import { getRecycleNum, getCustomerNum, getcapacityNum } from './api'

export const fetchCountAction = (payload: Business.SearchProps) => {
  Promise.all([getRecycleNum(payload), getCustomerNum(payload), getcapacityNum()]).then(([res, res2, res3]) => {
    const count = [
      res2.allNums,
      res2.trackContactNums,
      res2.newCustomerNums,
      res,
      res3
    ]
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        count
      }
    })
  })
}