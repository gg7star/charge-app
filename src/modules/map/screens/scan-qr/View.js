import React from 'react'
import { View, ScrollView, Image, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Torch from 'react-native-torch';
import { W, H, em } from '~/common/constants';
import { Spacer } from '~/common/components';
import QRScanner from './components/QRScanner';
import { rentButtery } from '~/common/services/station-gateway/gateway';

export default class ScanQRView extends React.Component {
  state = {
    qrCode: '',
    scanBarAnimateReverse: true,
    isTorchOn: false
  };

  onFlash = () => {
    const { isTorchOn } = this.state;
    Torch.switchState(!isTorchOn);
    this.setState({ isTorchOn: !isTorchOn });
  };


  onClickClose = () => {
    Actions['map_first']()
  };

  onReceivedQRCode = (scanedQrCode, callbackResumScan) => {
    this.setState({qrCode: scanedQrCode, scanBarAnimateReverse: false}, () => {
      var temp = scanedQrCode.split(' ');
      // For test
      const parsedStationSn = temp[temp.length-1]; //'T1219071904'; // need to parse from scanedQrCode
      console.log('==== QR code: ', scanedQrCode, parsedStationSn);
      // Check stationSN validation
      const { auth, map, mapActions, rentActions } = this.props;
      const { stationSnList } = map;
      if (stationSnList && stationSnList.find(e => e.stationSn === parsedStationSn)) {
        mapActions.scannedQrCode(parsedStationSn);
        const res = rentButtery({
          stationSn: parsedStationSn,
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
          Actions['map_first']({initialModal: 'rent'});
        }
        // rentActions.rentStation({
        //   stationSn: parsedStationSn,
        //   uuid: auth.credential.user.uid,
        //   pushToken: auth.fcm.token,
        //   deviceType: Platform.OS,
        //   onesignalUserId: auth.oneSignalDevice.userId
        // });
      } else {
        Alert.alert(
          'Invalid QR code',
          `${scanedQrCode}. The code is invalid. Please enter correct QR code of this station, again.`,
          [
            {text: 'OK', onPress: () => {
              callbackResumScan();
            }}
          ],
          {cancelable: false},
        );
      }
    });
  };

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
          <TouchableOpacity
            style={{
              flex: 1, width: 40, height: 40, 
              backgroundColor: '#9b9b9b',
              borderRadius: 15, marginRight: 15,
              alignItems: 'center', justifyContent: 'center'
            }}
            onPress={this.onFlash}
          >
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
  };

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
}
