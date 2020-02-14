import React from 'react';
import { Actions } from 'react-native-router-flux';
import HintWrapper from './HintWrapper';
import HintView from './HintView';

const HINT_FINT_STATION_IMAGE = require('~/common/assets/images/png/guide-find-station.png');

export default class View extends React.Component {
  render() {
    const { appActions } = this.props;
    const { _t } = appActions;

    return (
      <HintWrapper onClose={this.onClose}>
        <HintView
          onGoNext={this.onGoNext}
          onClose={this.onClose}
          image={HINT_FINT_STATION_IMAGE}
          title={_t('Find a station')}
          desc={_t('The app guides you to the nearest partner site')}
          nextButtonTitle={_t('Next')}
        />        
      </HintWrapper>
    )
  }

  onGoBack = () => {
  }

  onClose = () => {
    Actions.reset('hint');
    Actions['home']();
  };

  onGoNext = () => {
    Actions['signup_hint_scan_qr']()
  }
}
