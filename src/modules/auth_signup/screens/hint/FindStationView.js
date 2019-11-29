import React from 'react'
import HintWrapper from '../../common/wrappers/HintWrapper'
import HintView from '../../common/components/HintView'
import { Actions } from 'react-native-router-flux'

export default class View extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <HintWrapper onGoBack={this.onGoBack} onClose={this.onClose}>
        <HintView
          onGoNext={this.onGoNext}
          image={require('~/common/assets/images/png/guide-find-station.png')}
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
    Actions['authorized']()    
  }

  onGoNext = () => {
    Actions['signup_hint_scan_qr']()
  }
}
