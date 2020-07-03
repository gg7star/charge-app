import React from 'react'
import { Actions } from 'react-native-router-flux';
import { CustomCreditCard } from '~/common/components';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';

export default class CardForm extends React.Component {
  state = {}

  goBack = () => {
    // Actions.map();
    Actions['profile_payment']();
  }

  onValidate = ({cardInfo, cardToken}) => {
    const { stripeActions, auth } = this.props;
    stripeActions.registerCardRequest(
      {
        email: auth.credential.user.email,
        tokenId: cardToken.tokenId,
        cardInfo,
        cardToken
      },
      auth
    );
    this.goBack();
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <ProfileWrapper>
        <CustomCreditCard
          appActions={this.props.appActions}
          onValidate={this.onValidate}
          onCancel={this.goBack}/>
      </ProfileWrapper>
    )
  }
}
