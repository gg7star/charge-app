import React from 'react'
import { View, Text } from 'react-native'
import DialogWrapper from '../../common/wrappers/DialogWrapper';
import { Spacer, Button } from '~/common/components';
import { colors, W, H, em } from '~/common/constants';

export default class ConfirmAddCardDialog extends React.Component {  
  render() {
    return (
      <DialogWrapper>
        {this.renderTitle()}
        <Spacer size={20} />
        {this.renderActions()}
        <Spacer size={20} />
      </DialogWrapper>
    )
  }

  renderTitle() {
    const { _t } = this.props.appActions

    return (
      <View style={{
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#31313',
          fontSize: 22,
          fontWeight: '600',
          lineHeight: 42,
        }}>
          {_t('Credit card addition required')}
        </Text>
        <Text style={{
          color: '#31313',
          fontSize: 15,
          textAlign: "center"
        }}>
          {_t('For security reasons, a bank imprint is required for each use of our batteries. No debit will be made.')}
        </Text>
      </View>
    )
  }

  renderActions() {
    const { onCancel, onAdd, appActions } = this.props;
    const { _t } = appActions;

    return (
      <View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <View style={{ width: 150*em}}>
            <Button 
              textColor='white' bgColor='#797981' borderRadius={15}
              caption={_t('Cancel')}
              onPress={onCancel}
            />
          </View>
          <View style={{ width: 150*em}}>
            <Button 
              textColor={'white'} bgColor='#5ED8FC' borderRadius={15}
              caption={_t('Add')}
              onPress={onAdd}
            />
          </View>
        </View>
      </View>
    );
  }
}
