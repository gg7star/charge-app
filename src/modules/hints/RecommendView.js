import React from 'react'
import HintWrapper from './HintWrapper'
import HintView from './HintView'
import { Actions } from 'react-native-router-flux'

export default class View extends React.Component {

  onGoBack = () => Actions['signup_hint_bringback']();

  onClose = () => {
    Actions.reset('hint');
    Actions['home']();
  };

  onGoNext = () => this.onClose();

  render() {
    const { _t } = this.props.appActions

    return (
      <HintWrapper onGoBack={this.onGoBack} onClose={this.onClose}>
        <HintView
          onGoNext={this.onGoNext}
          image={require('~/common/assets/images/png/guide-sponsor.png')}
          title={_t('Sponsor your friends')}
          desc={_t('Earn credits to each sponsored friend!')}
          nextButtonTitle={_t('Next')}
        />        
      </HintWrapper>
    )
  }
}
