import React from 'react'
import ImportSteps from '@/modules/common/allot-steps'
import Step1 from './Step1'
import Step2 from './Step2'
class Main extends React.Component {
  public state = {
    step: 1
  }
  public config = [
    {
      title: '1、导入设置',
      component: (
        <Step1
          onOk={() => {
            this.setState({
              step: 2
            })
          }}
        />
      )
    },
    {
      title: '2、执行结果',
      component: <Step2 />
    }
  ]
  public render () {
    return (
      <div>
        <ImportSteps step={this.state.step} config={this.config} />
      </div>
    )
  }
}
export default Main