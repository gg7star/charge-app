import React from 'react'
import DialogWrapper from '../../common/wrappers/DialogWrapper'
import { View, StyleSheet } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W, em } from '~/common/constants'

const UNLOCK_ICON_IMAGE = require('~/common/assets/images/png/qr-code.png');

export default class FindNearestDialog extends React.Component {
  render() {
    const { onClickFind } = this.props
    const { _t } = this.props.appActions

    return (
      <View style={styles.container} >
        <Button
          // icon={require('~/common/assets/images/png/go.png')} iconColor='#fff'
          textColor='#fff'
          bgGradientStart='#ff52a8'
          bgGradientEnd='#ffdf00'
          caption={_t('Trouver la station la plus proche')}
          onPress={() => onClickFind()}
          textSize={13}
          containerHeight={40}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, zIndex: 10,
    width: 220 * em,
    height: 40,
    top: 57,
    left: W / 2 - 110 * em,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff00',
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  }
})
