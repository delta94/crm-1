import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import Entry from './Entry'
type Props = RouteComponentProps<{type: 'direct' | 'agent'}>
interface State {
  visible: boolean
}
class Main extends React.Component<Props, State> {
  public state: State = {
    visible: true
  }
  public componentWillReceiveProps (props: Props) {
    const type = this.props.match.params.type
    if (props.match.params.type !== type) {
      this.setState({
        visible: false
      }, () => {
        this.setState({
          visible: true
        })
      })
    }
  }
  public render () {
    const type = this.props.match.params.type === 'direct' ? 'DirectCompany' : 'Agent'
    console.log(type, 'type xxxxx')
    return (
      <div>
        {
          this.state.visible && <Entry
            type={type}
          />
        }
      </div>
    )
  }
}
export default Main
