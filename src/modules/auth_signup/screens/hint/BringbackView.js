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
          image={require('~/common/assets/images/png/guide-bring-back.png')}
          title={_t('Bring back your nono')}
          desc={_t('Choose the nearest partner institution')}
          nextButtonTitle={_t('Next')}
        />
      </HintWrapper>
    )
  }

  onGoBack = () => {
    Actions['signup_hint_saved']()
  }

  onClose = () => {
    Actions['authorized']()    
  }

  onGoNext = () => {
    Actions['signup_hint_recommend']()
  }
}
