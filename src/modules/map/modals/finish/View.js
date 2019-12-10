import React from 'react'
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper'
import { View, Text } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W, H, em } from '~/common/constants'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { place, direction } = this.props.map

    return (
      <Dialog2Wrapper>
        <View style={{ flexDirection: 'row' }}>
          <View style={{width: 250*em}}>
            <Text style={{ fontWeight: 'bold', fontSize: 22, color: colors.primary }}>
              {`${direction.duration} min`}
            </Text>
            <Text style={{ fontSize: 15*em, color: '#7e888d'}}>
              {`${direction.duration}mn - ${direction.distance}m`}
            </Text>
          </View>
          <View style={{ width: 70*em }}>
            <Button bgColor='#fa6868' textColor='#fff'
              caption={_t('Leave')} onPress={this.props.onFinish}
            />
          </View>
        </View>
        <Spacer size={20} />
      </Dialog2Wrapper>
    )
  }
}
