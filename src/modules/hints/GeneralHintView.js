import React from 'react';
import { Actions } from 'react-native-router-flux';
import HintWrapper from './HintWrapper';
import HintView from './HintView';

export default class GeneralHintView extends React.Component {
  onGoBack = () => {
    const { backPath } = this.props;
    backPath && Actions[backPath]();
  };

  onClose = () => {
    Actions.reset('hint');
    Actions['home']();
  };

  onGoNext = () => {
    const { nextPath } = this.props;
    if (nextPath) Actions[nextPath]();
    else this.onClose();
  };

  render() {
    const {
      appActions,
      image,
      title,
      description,
      buttonText,
      backPath
    } = this.props;
    const { _t } = appActions;

    return (
      <HintWrapper onClose={this.onClose} onGoBack = {backPath ? this.onGoBack : null}>
        <HintView
          onGoNext={this.onGoNext}
          onClose={this.onClose}
          image={image}
          title={_t(title)}
          desc={_t(description)}
          nextButtonTitle={_t(buttonText)}
        />        
      </HintWrapper>
    )
  }
}
