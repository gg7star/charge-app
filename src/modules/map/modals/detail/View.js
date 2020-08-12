import React from 'react';
import Dialog2Wrapper from '~/modules/map/common/wrappers/Dialog2Wrapper';
import { View } from 'react-native';
import { Button, Spacer } from '~/common/components';
import { colors, W, H, em } from '~/common/constants';
import DetailInfo from './components/DetailInfoContainer';

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { place, direction } = this.props.map

    return (
      <React.Fragment>
        <View
          style={{
            position: 'absolute', zIndex: 35,
            left: 0, top: 0, width: W, height: H,
            backgroundColor: 'rgba(0, 0, 0, 0.44)'
          }}
        />
        {place &&
          <Dialog2Wrapper onClose={this.props.onClose}>
            <DetailInfo data={place} distance={direction.distance} />
            <Spacer size={20 * em} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Button 
                icon={require('~/common/assets/images/png/go.png')} iconColor='#fff'
                textColor='#fff'
                bgGradientStart='#ff52a8' bgGradientEnd='#ffdf00'
                caption={
                  direction.duration
                  ? `${direction.duration} - ${direction.distance}`
                  : ''
                }
                onPress={() => this.props.onFinish()}
              />
            </View>
          </Dialog2Wrapper>
        }        
      </React.Fragment>
    )
  }
}
