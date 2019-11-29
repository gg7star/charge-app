import React from 'react'
import DialogWrapper from '../../common/wrappers/DialogWrapper'
import { View } from 'react-native'
import { Button, Spacer } from '~/common/components'
import { colors, W } from '~/common/constants'

export default class Dialog extends React.Component {
  render() {
    const { onGoScan } = this.props
    const { _t } = this.props.appActions

    return (
      <DialogWrapper>
        <Button
          bgColor={colors.primaryBackground}
          textColor={'#fff'}
          icon={require('~/common/assets/images/png/qr-code.png')}  iconColor={'#fff'}
          caption={_t('Unlocks a nono')}
          onPress={onGoScan}
        />
        <Spacer size={30} />
      </DialogWrapper>
    )
  }
}
