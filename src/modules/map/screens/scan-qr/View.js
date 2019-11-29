import React from 'react'
import { View, ScrollView, Image, Text, TouchableOpacity, Alert } from 'react-native'
import { W, H, em } from '~/common/constants'
import { Spacer } from '~/common/components'
import QRScanner from './components/QRScanner'
import { Actions } from 'react-native-router-flux'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

export default class ScreenView extends React.Component {
  state = {
    qrCode: '',
    scanBarAnimateReverse: true
  }

  render = () => {
    const { qrCode } = this.state;
    const { onSwitchToQRCodeInput, appActions } = this.props;
    const { _t } = appActions;
    return (
      <View style={{flex:1}}>
        < QRScanner
          onScanResult={ this.onReceivedQRCode }
          renderHeaderView={ this.renderTitleBar }
          renderFooterView={ <this.renderBottom onSwitchToQRCodeInput={onSwitchToQRCodeInput}/>}
          scanBarAnimateReverse={ true }
          hintText={`${_t('QR code not detected?')} ${_t('Enter the number of the station')}`}
        />
      </View>
    )
  } 

  renderTitleBar = () => {
    const { _t } = this.props.appActions;
    const { qrCode } = this.state;
    return qrCode ? (
      <Text style={{color:'white',textAlign:'center',padding:16}}>
        {qrCode}
      </Text>
    ) :(
      <View>
        <Text style={{color:'white',textAlign:'center',padding:16}}>
          {_t('Last step')}
        </Text>
        <Spacer size={30}/>
        <Text style={{color:'white',textAlign:'center',padding:16}}>
          {_t('Enter the number under the QR Code')}
        </Text>
      </View>
    );
  }

  renderBottom = () => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column'
      }}>
        <View style={{
          flex: 1, alignItems: 'flex-end'
        }}>
          <TouchableOpacity style={{
            flex: 1, width: 40, height: 40, 
            backgroundColor: '#9b9b9b',
            borderRadius: 15, marginRight: 15,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Image 
              style={{
                tintColor: '#fff',
                height: 20
              }} 
              source={require('~/common/assets/images/png/flash-QR-code.png')}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <Spacer size={15}/>
        <View style={{
          flex: 1,
          flexDirection: 'row'
        }}>
          <TouchableOpacity style={{
            flex: 1,
            alignItems: 'flex-start',            
          }} onPress={() => this.onClickClose()}>
            <MaterialIcon name="close" style={{
              color: '#fff',
              width: 40, height: 40,
              borderRadius: 15,
              overflow: 'hidden',
              backgroundColor: '#9b9b9b',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
              fontWeight: "400",
              marginLeft: 15,
              paddingTop: 10, paddingLeft: 10
            }} />
          </TouchableOpacity>
          <TouchableOpacity style={{
            flex: 1,
            alignItems: 'flex-end'            
          }} onPress={() => Actions['map_enter_code']()}>
            <Text style={{
              color: '#fff',
              width: 40, height: 40,
              backgroundColor: '#9b9b9b',
              paddingLeft: 12, paddingTop: 13,              
              fontSize: 10,
              fontWeight: "400",
              marginRight: 15,
              borderRadius: 15,
              overflow: 'hidden'
            }}>123</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <Spacer size={30}/>
        </View>
      </View>
    )
  }

  onClickClose = () => {
    Actions['map_first']()
  }

  onReceivedQRCode = (event) => {    
    this.setState({qrCode: event.data, scanBarAnimateReverse: false}, () => {
      console.log('==== QR code: ', this.state.qrCode);
      const { qrCode }= this.state
      Alert.alert(
        'Scaned QR Code',
        `${qrCode}. Are you sure to pay to this device?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
            this.props.mapActions.scannedQrCode(this.state.qrCode);
            Actions['map_first']({initialModal: 'rent'})
          }},
        ],
        {cancelable: false},
      );
    });
  };
}