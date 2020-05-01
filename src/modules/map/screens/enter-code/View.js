import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Torch from 'react-native-torch';
import { Spacer } from '~/common/components';
import { W, H, colors, em } from '~/common/constants';
import { rentButtery } from '~/common/services/station-gateway/gateway';
import MAP_MODAL from '~/common/constants/map';

export default class ScreenView extends React.Component {
  state = {
    adjust: {
      containerHeight: H
    },
    // codes: ['', '', '', '', '', '']
    code: '',
    isTorchOn: false
  }

  onClickFlash = () => {
    const { isTorchOn } = this.state;
    Torch.switchState(!isTorchOn);
    this.setState({ isTorchOn: !isTorchOn });
  }
  
  onClickCross = () => {
    Actions['map_scan_qr']()
  }

  onClickEnter = () => {
    this.enterCode()
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <ScrollView style={{
        flex: 1, 
      }}>
      <View style={{
        width: W, height: this.state.adjust.containerHeight, 
        backgroundColor: colors.primaryBackground,
        position: 'relative'
      }}>
        <Spacer size={120} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
            {_t('Enter the code')}
          </Text>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {_t('The code is located under the QR Code')}
          </Text>
        </View>
        <Spacer size={80} />
        {this.renderForm()}
        {this.renderActionButtons()}
      </View>
      </ScrollView>
    )
  }

  renderForm() {
    let { code } = this.state

    return (
      <View style={{ 
        paddingHorizontal: 10, 
        flexDirection: 'row', justifyContent: 'space-between'
      }}>
        <TextInput
          value={code}
          onChangeText={val => {
            this.setState({code: val})
          }}
          style={{
            textAlign: 'center', color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderBottomWidth: 2,
            width: '100%',
            height: 50*em
          }}
          onSubmitEditing={this.enterCode}
        />
      </View>
    )
  }

  renderActionButtons() {
    return (
      <React.Fragment>
        <ActionButton
          containerStyle={{ right: 10, bottom: 68 }}
          image={require('~/common/assets/images/png/flash-QR-code.png')} 
          onPress={this.onClickFlash}
        />
        <ActionButton
          containerStyle={{ left: 10, bottom: 14 }}
          image={require('~/common/assets/images/png/cross.png')}
          onPress={this.onClickCross}
        />
        <ActionButton
          containerStyle={{ right: 10, bottom: 14 }}
          image={require('~/common/assets/images/png/qr-code.png')}
          onPress={this.onClickEnter}
        />
      </React.Fragment>
    )
  }

  enterCode = () => {
    const { code } = this.state;
    const { stationSnList } = this.props.map;
    const { auth, mapActions } = this.props;

    Alert.alert(
      'Entered QR Code',
      `${code}. Are you sure to rent to this device?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          // Check stationSN validation
          if (stationSnList && stationSnList.find(e => e.stationSn === code)) {
            this.props.mapActions.scannedQrCode(code);
            const res = rentButtery({
              stationSn: code,
              uuid: auth.credential.user.uid,
              pushToken: auth.fcm.token,
              deviceType: Platform.OS,
              onesignalUserId: auth.oneSignalDevice.userId
            });
            if (res.error) {
              Alert.alert(
                'Failed to rent the buttery',
                `Failed to rent the buttery. Please try, again, later.`,
                [
                  {text: 'OK', onPress: () => {}}
                ],
                {cancelable: false},
              );
            } else {
              // For test
              mapActions.setActiveModal(MAP_MODAL.RENT);
              Actions['map_first']();
              // Actions['map_first']({initialModal: MAP_MODAL.RENT});
            }
            // this.props.rentActions.rentStation({
            //   stationSn: code,
            //   uuid: auth.credential.user.uid,
            //   pushToken: auth.fcm.token,
            //   deviceType: Platform.OS,
            //   onesignalUserId: auth.oneSignalDevice.userId
            // })
          } else {
            Alert.alert(
              'Invalid QR code',
              `${code}. The code is invalid. Please enter correct QR code of this station, again.`,
              [
                {text: 'OK', onPress: () => {}}
              ],
              {cancelable: false},
            );
          }
        }},
      ],
      {cancelable: false},
    );
  }
}

const ActionButton = (props) => (
  <TouchableOpacity
    style={[
      {
        width: 44, height: 44,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute', borderRadius: 12
      },
      props.containerStyle
    ]}
    onPress={props.onPress}>
    <Image 
      style={{ tintColor: 'white' }}
      source={props.image} 
    />
  </TouchableOpacity>
)
