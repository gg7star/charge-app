import React from 'react'
import { Toast } from 'native-base'

export default class ToastShow extends React.Component {
  state = {
    toastShow: true
  }

  render() {
    const { message, messageType, onClearMessage } = this.props

    if (this.state.toastShow && message != '' && message != '???') {
      Toast.show({
        type: messageType,
        text: message,
        position: 'top',
        duration: 4000
      })
      this.setState({...this.state, toastShow: false})
      setTimeout(() => {
        this.setState({...this.state, toastShow: true})
        onClearMessage()
      }, 4000)
    }

    return (
      <>
      </>
    )
  }
}

