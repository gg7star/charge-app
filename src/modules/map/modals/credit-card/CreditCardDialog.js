import React from 'react';
import Modal from "react-native-modal";
import { Platform } from 'react-native';
import { CustomCreditCard } from '~/common/components';
import { H, W } from '~/common/constants';

export default class CreditCardDialog extends React.Component {
  state = {};


  render() {
    const { isVisible, onValidate, onCancel, appActions } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        coverScreen
        style={{
          margin: 0,
          padding: 20,
          paddingTop: 12,
          backgroundColor: 'white'
        }}
      >
        <CustomCreditCard
          appActions={appActions}
          onValidate={onValidate}
          onCancel={onCancel}
        />
      </Modal>
    );
  }
}
