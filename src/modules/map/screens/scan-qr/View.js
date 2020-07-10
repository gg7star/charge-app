import React from 'react'
import { View, ScrollView, Image, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Torch from 'react-native-torch';
import Spinner from 'react-native-loading-spinner-overlay';
import { W, H, em } from '~/common/constants';
import { Spacer } from '~/common/components';
import QRScannerContainer from './components/QRScannerContainer';
import { rentBattery } from '~/common/services/station-gateway/gateway';
import MAP_MODAL from '~/common/constants/map';
import { RENT_EXPIRE_TIMEOUT } from '~/common/constants/rent';

export default class ScanQRView extends React.Component {
  state = {
    qrCode: '',
    scanBarAnimateReverse: true,
    isTorchOn: false,
    rentingBattery: false,
    startRentTime: null
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { rent } = nextProps;
    const { isRented, isFetching } = rent;
    const { rentingBattery } = this.state;
    
    this.setState({ rentingBattery: isFetching });
  }

  onFlash = () => {
    const { isTorchOn } = this.state;
    Torch.switchState(!isTorchOn);
    this.setState({ isTorchOn: !isTorchOn });
  };

  onClickClose = () => {
    Actions['map_first']();
  };

  onRentTimedOut = () => {
    console.log('===== this.onRentTimedOut');
    this.setState({rentingBattery: false});
    this.props.rentActions.rentFailure({error: 'Timed out'});
  }

  onReceivedQRCode = (scanedQrCode, callbackResumScan) => {
    const _this = this;
    const { _t } = this.props.appActions;
    this.setState({qrCode: scanedQrCode, scanBarAnimateReverse: false});
    // , () => {
      var temp = scanedQrCode.split(' ');
      // For test
      const parsedStationSn = temp[temp.length-1]; // need to parse from scanedQrCode
      console.log('==== QR code: ', scanedQrCode, parsedStationSn);
      // Check stationSN validation
      const { auth, map, mapActions, rentActions } = _this.props;
      const { stationSnList } = map;
      if (stationSnList && stationSnList.find(e => e.stationSn === parsedStationSn)) {
        console.log('==== mapActions.scannedQrCode: ', parsedStationSn);
        mapActions.scannedQrCode(parsedStationSn);
        _this.setState({rentingBattery: true});
        console.log('==== rentBattery ');
        const res = rentBattery({
          stationSn: parsedStationSn,
          uuid: auth.credential.user.uid,
          pushToken: auth.fcm.token,
          deviceType: Platform.OS,
          onesignalUserId: auth.oneSignalDevice.userId
        });
        if (res.error) {
          Alert.alert(
            _t('Failed to rent the battery'), 
            _t(`Failed to rent the battery. Please try, again, later.`),
            [
              {text: 'OK', onPress: _this.onRentTimedOut}
            ],
            {cancelable: false},
          );
        } else {
          // setTimeout(() => {
          //   console.log('==== setTimout, _this.state: ', _this.state)
          //   if (_this.state.rentingBattery) {
          //     Alert.alert(
          //       _t('Renting timed out'), 
          //       _t('Timed out to rent battery. Please try later.')
          //       [
          //         {text: 'OK', onPress: () => _this.onRentTimedOut()}
          //       ],
          //       {cancelable: false},
          //     );
          //     _this.onRentTimedOut();
          //   }
          // }, RENT_EXPIRE_TIMEOUT);

          rentActions.rentStation({
            stationSn: parsedStationSn,
            uuid: auth.credential.user.uid,
            pushToken: auth.fcm.token,
            deviceType: Platform.OS,
            onesignalUserId: auth.oneSignalDevice.userId
          });

          Actions['map_first']();
        }
      } else {
        Alert.alert(
          _t('Invalid QR code'),
          `${scanedQrCode}. ${_t('The code is invalid. Please enter correct QR code of this station, again.')}`,
          [
            {text: 'OK', onPress: () => {
              callbackResumScan();
            }}
          ],
          {cancelable: false},
        );
      }
    // });
  };

  renderTitleBar = () => {
    const { _t } = this.props.appActions;
    const { qrCode } = this.state;
    return qrCode ? (
      <Text style={{color:'white',textAlign:'center',padding:16}}>
        {qrCode}
      </Text>
    ) : (
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
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
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-start'}}
            onPress={() => this.onClickClose()}
          >
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
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() => Actions['map_enter_code']()}
          >
            <Text
              style={{
                color: '#fff',
                width: 40, height: 40,
                backgroundColor: '#9b9b9b',
                paddingLeft: 12, paddingTop: 13,
                fontSize: 10,
                fontWeight: "400",
                marginRight: 15,
                borderRadius: 15,
                overflow: 'hidden'
              }}
            >
              123
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <Spacer size={30}/>
        </View>
      </View>
    )
  };

  render = () => {
    const { qrCode, rentingBattery } = this.state;
    const { onSwitchToQRCodeInput, appActions } = this.props;
    const { _t } = appActions;
    return (
      <View style={{flex:1}}>
        < QRScannerContainer
          onScanResult={ this.onReceivedQRCode }
          renderHeaderView={ this.renderTitleBar }
          renderFooterView={ <this.renderBottom onSwitchToQRCodeInput={onSwitchToQRCodeInput}/>}
          scanBarAnimateReverse={ true }
          hintText={`${_t('QR code not detected?')} ${_t('Enter the number of the station')}`}
        />
        <Spinner
          visible={rentingBattery}
          textContent={_t('Renting a battery...')}
          textStyle={{color: '#FFF'}}
        />
      </View>
    )
  } 
}
