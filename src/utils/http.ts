import loading from 'pilipa/libs/loading'
import store from '@/store'

$(document).ajaxSend((event, response, options) => {
  store.dispatch({type: 'loading show'})
  const { ajaxCount } = store.getState().common
  if (ajaxCount > 0 && $('.pilipa-loading').length === 0) {
    // loading.show()
  }
})

$(document).ajaxComplete((event, response, options) => {
  store.dispatch({type: 'loading hidden'})
  const { ajaxCount } = store.getState().common
  if (ajaxCount <= 0) {
    loading.hide()
  }
})
$(document).ajaxError((event, response) => {
})
const RequestTypes = ['GET', 'POST', 'DELETE', 'PUT']
export interface AjaxConfigProps extends JQuery.AjaxSettings {
  type?: RequestTypeProps
  raw?: boolean
  extension?: JQuery.AjaxSettings
}
type RequestTypeProps = 'GET' | 'POST' | 'DELETE' | 'PUT'
const http = <D>(url: string, type?: RequestTypeProps, config?: AjaxConfigProps extends D ? D : any) => {
  config = Object.assign({}, config)
  if (typeof type === 'object') {
    config = type
    if (typeof config.type === 'string' && RequestTypes.indexOf(config.type.toUpperCase()) > -1) {
      type = config.type || 'GET'
      delete (config.type)
    } else {
      type = 'GET'
    }
  } else {
    type = type || 'GET'
  }
  const extension = config.extension || {}
  delete config.extension
  const data = config.data || config || {}
  const headers = config.headers || undefined
  let ajaxConfig: JQuery.AjaxSettings = {
    url,
    method: type,
    headers,
    contentType: config.contentType !== undefined ? config.contentType : 'application/json; charset=utf-8',
    data,
    timeout: 10000
  }
  if (extension) {
    ajaxConfig = $.extend(true, ajaxConfig, extension)
  }
  delete config.headers
  delete config.contentType
  const raw = config.raw || false
  switch (type) {
  case 'POST':
    ajaxConfig.processData = config.processData || false
    ajaxConfig.data = raw ? data : JSON.stringify(data)
    break
  case 'PUT':
    ajaxConfig.processData = config.processData || false
    ajaxConfig.data = raw ? data : JSON.stringify(data)
    break
  case 'DELETE':
    ajaxConfig.processData = config.processData || false
    ajaxConfig.data = raw ? data : JSON.stringify(data)
    break
  }
  return $.ajax(ajaxConfig).then((res) => {
    let result = {}
    if (typeof res === 'string') {
      try {
        result = JSON.parse(res)
      } catch (e) {
        result = res
      }
    } else {
      result = res
    }
    return result
  }, (err) => {
    return err
  })
}
export default http
