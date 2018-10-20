import React from 'react'
import { Button } from 'antd'
import Modal from 'pilipa/libs/modal'
import Detail from '@/modules/customer/detail'
import Provider from '@/components/Provider'
import ToOpenReason from '../ToOpenReason'
import { toOpen } from '../api'
import store from '@/store'
import { changeCustomerDetailAction } from '@/modules/customer/action'
export default function (record: Business.DetailProps, cb?: () => void) {
  let customerId = record.id
  const that = this
  let reason: {value: string, label: string} = { value: '', label: ''}
  const modal = new Modal({
    content: (
      <Provider>
        <Detail
          type='business'
          getWrappedInstance={(ins) => {
            that.ins = ins
          }}
          onClose={() =>
            modal.onCancel()
          }
          customerId={customerId}
          footer={(
            <div className='mt10'>
              <div style={{ display: 'inline-block', width: 160, marginLeft: 450}}>
                <Button
                  type='primary'
                  className='mr5'
                  onClick={() => {
                    const modal1 = new Modal({
                      content: (
                        <ToOpenReason onChange={(item) => { reason = item }}/>
                      ),
                      title: '转公海',
                      mask: true,
                      onOk: () => {
                        customerId = store.getState().customer.detail.id
                        if (!reason.label) {
                          APP.error('请选择原因！')
                          return false
                        }
                        const openparams = {
                          customerIdArr: [customerId],
                          bus_sea_memo: reason.label
                        }
                        toOpen(openparams).then(() => {
                          APP.success('操作成功')
                          if (cb) {
                            cb()
                          }
                        })
                        modal1.hide()
                      },
                      onCancel: () => {
                        modal1.hide()
                      }
                    })
                    modal1.show()
                  }}
                >
                  转公海
                </Button>
                <Button
                  type='ghost'
                  onClick={() => {
                    that.ins.save().then(() => {
                      APP.success('保存成功')
                    })
                  }}
                >
                  保存
                </Button>
              </div>
              <div style={{ display: 'inline-block', width: 160, marginLeft: 100}}>
                <Button
                  type='primary'
                  onClick={() => {
                  }}
                >
                  上一条
                </Button>
                <Button
                  style={{ marginLeft: 5}}
                  type='ghost'
                  onClick={() => {
                    // this.fetchList().then((res) => {
                    //   const data = res.data
                    //   if (data instanceof Array && data[index]) {
                    //     customerId = data[index].id
                    //     changeCustomerDetailAction(customerId)
                    //   } else {
                    //     modal.hide()
                    //   }
                    // })
                  }}
                >
                  下一条
                </Button>
              </div>
            </div>
          )}
        />
      </Provider>
    ),
    footer: null,
    header: null,
    mask: true,
    onCancel: () => {
      modal.hide()
      this.fetchCount()
      this.fetchList()
    }
  })
  modal.show()
  return modal
}
