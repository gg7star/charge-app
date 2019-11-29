import React from 'react'
import { View, Text,  } from 'react-native'
import { Toast } from 'native-base'
import SetWrapper from '../../common/wrappers/SetWrapper'
import { Actions } from 'react-native-router-flux'
import moduleStyles from '../../common/styles'
import { em } from '~/common/constants'
import { Spacer, Button, ToastShow } from '~/common/components'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

export default class ScreenView extends React.Component {
  state = {
    birthday: new Date(),
    toastShow: true,
    adjust: {
      fixedBottom: 40*em
    }    
  }

  render() {
    const { _t } = this.props.appActions
    const { statusMessage, statusMessageType, isFetching } = this.props.signup

    return (
      <SetWrapper onGoBack={this.onGoBack} onPass={this.onPass} passText={_t('Pass')}>
        {/* <ToastShow 
          message={_t(statusMessage)}
          messageType={statusMessageType}
          onClearMessage={this.props.signupActions.clearMessage}
        /> */}
        <Text style={moduleStyles.text.title}>
          {_t('What is your date of birth?')}
        </Text>
        <Spacer size={30} />
        <DatePicker
          date={this.state.birthday}
          mode={'date'}
          textColor={'#ffffff'}
          onDateChange={ birthday => this.setState({ ...this.state, birthday }) }
          style={[moduleStyles.input.setField, {backgroundColor: 'transparent'}]}
        />
        <View style={[moduleStyles.bottomActionBar, {bottom: this.state.adjust.fixedBottom}]}>
          <Button
            onPress={this.onFinish}
            caption={_t('Finish')}
            loading={isFetching}
            disabled={isFetching}
          />
        </View>
      </SetWrapper>
    )
  } 

  onGoBack = () => {
    Actions['signup_set_email']()
  }

  onFinish = () => {    
    const { birthday } = this.state;
    let birthday_ = new Date(birthday)
    birthday_ = moment(birthday_).format('YYYY-MM-DD')
    this.props.signupActions.setBirthday(birthday_)
    this.props.signupActions.trySignup(this.props.signup)
  }

  onPass = () => {
    Actions['signup_hint_find_station']()
  }

}
