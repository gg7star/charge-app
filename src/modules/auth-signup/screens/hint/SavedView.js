import React from 'react'
import HintWrapper from '../../common/wrappers/HintWrapper'
import HintView from '../../../../common/components/HintView'
import { Actions } from 'react-native-router-flux'

export default class View extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <HintWrapper onGoBack={this.onGoBack} onClose={this.onClose}>
        <HintView
          onGoNext={this.onGoNext}
          image={require('~/common/assets/images/png/guide-save.png')}
          title={_t('That\'s it... you\'re saved!')}
          desc={_t('Choose the right cable and charge your phone freely')}
          nextButtonTitle={_t('Next')}
        />
      </HintWrapper>
    )
  }

  onGoBack = () => {
    Actions['signup_hint_scan_qr']()
  }

  onClose = () => {
    Actions['authorized']()    
  }

  onGoNext = () => {
    Actions['signup_hint_bringback']()
  }
}
