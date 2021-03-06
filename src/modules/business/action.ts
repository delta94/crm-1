import store from '@/store'
import { getRecycleNum, getCustomerNum, getcapacityNum, fetchList } from './api'

export const fetchCountAction = (payload: Business.SearchProps) => {
  Promise.all([getRecycleNum(payload), getCustomerNum(payload), getcapacityNum()]).then(([res, res2, res3]) => {
    const count = [
      res2.newCustomerNums,
      res2.intentionNums,
      res2.noIntentionNums,
      res,
      res3.data
    ]
    APP.dispatch<Business.Props>({
      type: 'change business data',
      payload: {
        count
      }
    })
  })
}
// export const changeVisibleAction = (visibled: boolean = true) => {
//   APP.dispatch<Business.Props>({
//     type: 'change business data',
//     payload: {
//       visibled
//     }
//   })
// }
