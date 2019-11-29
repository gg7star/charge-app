import React from 'react'
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper'
import { View } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import DetailInfo from './components/DetailInfoContainer'
import ActionBar from './components/ActionBarContainer'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { place } = this.props.map

    return (
      <React.Fragment>
        <View style={{
          position: 'absolute', zIndex: 35,
          left: 0, top: 0, width: W, height: H,
          backgroundColor: 'rgba(0, 0, 0, 0.44)'
        }}>
        </View>
        {place &&
        <Dialog2Wrapper onClose={this.props.onClose}>
          <DetailInfo data={place} />
          <Spacer size={20} />
          <ActionBar data={place} onFinish={this.props.onFinish} onReserve={this.props.onReserve}/>
        </Dialog2Wrapper>
        }        
      </React.Fragment>
    )
  }
}
