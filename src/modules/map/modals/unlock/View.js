import React from 'react'
import DialogWrapper from '../../common/wrappers/DialogWrapper'
import { View } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W } from '~/common/constants'

const UNLOCK_ICON_IMAGE = require('~/common/assets/images/png/qr-code.png');

export default class Dialog extends React.Component {
  render() {
    const { onClickUnlock } = this.props
    const { _t } = this.props.appActions

    return (
      <DialogWrapper transparent={true} zIndex={10}>
        <Button
          bgColor={colors.primaryBackground}
          textColor={'#fff'}
          icon={UNLOCK_ICON_IMAGE}
          iconColor={'#fff'}
          caption={_t('Unlocks a nono')}
          onPress={onClickUnlock}
        />
        <Spacer size={30} />
      </DialogWrapper>
    )
  }
}
