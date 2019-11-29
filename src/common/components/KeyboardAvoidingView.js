import React from "react"
import { KeyboardAvoidingView, ScrollView } from "react-native"

export default class KeyboardAvoidingViewFix extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        enabled
      >
        <ScrollView contentContainerStyle={{flex: 1}}>
          {this.props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
