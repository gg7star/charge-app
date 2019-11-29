import React from 'react'
// import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { View } from 'react-native'
import { H } from '~/common/constants'

export default class ScreenView extends React.Component {
  render() {
    return (
      <View style={{
        justifyContent: 'center', alignItems: 'center'
      }}>
        <RNCamera style={{ flex: 1, width: '100%', height: H }} 
          ref={ref=>{this.camera=ref}}
        >
        </RNCamera>
      </View>
    )
  }

  detectQrCode = ({ barcodes }) => {
    barcodes.forEach(barcode => console.log(barcode.data))
  }
}
