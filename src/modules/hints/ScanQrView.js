import React from 'react'
import HintWrapper from '../auth-signup/common/wrappers/HintWrapper'
import HintView from '../../common/components/HintView'
import { Actions } from 'react-native-router-flux'

export default class View extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <HintWrapper onGoBack={this.onGoBack} onClose={this.onClose}>
        <HintView
          onGoNext={this.onGoNext}
          image={require('~/common/assets/images/png/guide-scan.png')}
          title={_t('Scan and unlock a nono')}
          desc={_t('Scan the QR code on the station.')+' '+_t('Your nono is unlocked!')}
          nextButtonTitle={_t('Next')}
        />        
      </HintWrapper>
    )
  }

  onGoBack = () => Actions['signup_hint_find_station']();

  onClose = () => {
    Actions.reset('hint');
    Actions['home']();
  };

  onGoNext = () => Actions['signup_hint_saved']();
}
