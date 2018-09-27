// 客资管理
import _ from 'lodash'
import { handleActions } from 'redux-actions'
const defaultVal: Customer.Props = {
  linkMan: [{
    contactPerson: '',
    contactPhone: ''
  }],
  dataSource: [],
  detail: {},
  autoAssign: [{
    bigAreaName: '22',
    cityName: '222',
    agencyName: '222',
    autoDistributeWeight: '333',
    autoDistributeMaxNum: '11'
  }],
  capacity:[]
}
export default handleActions<Customer.Props>({
  'change customer data': (state, { payload }) => {
    payload = _.merge(_.cloneDeep(defaultVal), payload)
    payload = Object.assign({}, state, _.cloneDeep(payload))
    return {
      ...state,
      ...payload
    }
  },
  'change customer set auto data': (state, { payload }) => {
    payload = _.merge(_.cloneDeep(defaultVal), payload)
    payload = Object.assign({}, state, _.cloneDeep(payload))
    return {
      ...state,
      ...payload
    }
  },
  'change customer set capacity data': (state, { payload }) => {
    payload = _.merge(_.cloneDeep(defaultVal), payload)
    payload = Object.assign({}, state, _.cloneDeep(payload))
    return {
      ...state,
      ...payload
    }
  }
}, _.cloneDeep(defaultVal))
