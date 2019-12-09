import React from 'react'
import { View, TextInput } from 'react-native'
import CodeInput from 'react-native-confirmation-code-input'
import { colors } from '~/common/constants'

export default class ConfirmCodeInput extends React.Component {
  render() {
    return (
      <View>
        <CodeInput
          ref='confirmCodeInput'
          size={50}
          codeLength={6}
          autoFocus={false}
          containerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
          codeInputStyle={{ borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.15)'}}
          onFulfill={this.props.onFulfill}
        />
      </View>
    )
  }
}
