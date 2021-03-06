import React from 'react'
import ImportSteps from '@/modules/common/import-steps'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
interface Props {
  onClose?: () => void
}
class Main extends React.Component<Props> {
  public value: any = {}
  public resuleData: any = {}
  public state = {
    step: 1
  }
  public config = [
    {
      title: '1、导入设置',
      component: (
        <Step1
          onOk={(value) => {
            console.log(value, 'value')
            this.value.step1 = value
            this.setState({
              step: 2
            })
          }}
        />
      )
    },
    {
      title: '2、上传文件',
      component: (
        <Step2
          paramsValue={this.value}
          onOk={(value) => {
            this.value.step2 = value
            this.setState({
              step: 3
            })
          }}
          onPre={() => {
            this.setState({
              step: 1
            })
          }}
        />
      )
    },
    {
      title: '3、执行结果',
      component: (
        <Step3
          resuleData={this.value}
          onCancel={() => {
            if (this.props.onClose) {
              this.props.onClose()
            }
          }}
        />
      )
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
