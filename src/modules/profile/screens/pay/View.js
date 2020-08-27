import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { W, H, em } from '~/common/constants';
import { Button } from '~/common/components';
import Header from './components/HeaderContainer';
import ActionBar from './components/ActionBarContainer';
import PriceBox from './components/PriceBoxContainer';
import { Actions } from 'react-native-router-flux';
import ToggleSwitch from 'toggle-switch-react-native';

export default class ScreenView extends React.Component {
  state = {
    rechargable: false,
    payment: null
  }

  render() {
    const { _t } = this.props.appActions;
    const { rechargable } = this.state;

    return (
      <View style={{
        backgroundColor: '#5ed8fc', 
        flex: 1, 
        position: 'relative', width: W, height: H,
      }}>
        <Header />
        <Wrapper>
          {this.renderForm()}          
        </Wrapper>
        <ActionBar />
      </View>
    )
  }

  goBack = () => {
    // Actions['profile_wallet']()
    const { onClose } = this.props;
    onClose && onClose();
  }

  addCoupon = () => {
    this.props.profileActions.addCoupon()
  }

  renderForm() {
    const { _t } = this.props.appActions
    const { payments } = this.props.profile

    return (
      <View style={{paddingVertical: 30, paddingHorizontal: 10}}>
        {this.renderRechargeToggle()}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%'}}>
            <PriceBox payment={payments[0]} />
          </View>
          <View style={{ width: '50%'}}>
            <PriceBox payment={payments[1]} />
          </View>
        </View>
        <View style={{ width: '100%'}}>
          <PriceBox payment={payments[2]} />
        </View>
        <View style={{ width: '100%'}}>
          <PriceBox payment={payments[3]} />
        </View>
        <Text style={{ 
          color: '#313131', fontSize: 13,
          width: '100%', textAlign: 'center', marginVertical: 10
        }}>
          {`${_t('A deposit of')} ${'20€'} ${_t('will be required to rent a battery.')} ${_t('Know more')}`}
        </Text>
        <Text style={{ 
          color: '#313131', fontSize: 13,
          width: '100%', textAlign: 'center', marginVertical: 10
        }}>
          {`${_t('Deposit taken out of your wallet if the balance is sufficient or otherwise it will be charged to your')}`}
        </Text>
      </View>
    )
  }

  renderRechargeToggle() {
    const { _t } = this.props.appActions

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 17, color: '#bfbfc4' }}>
          {_t('Open now')}
        </Text>        
        <ToggleSwitch
          isOn={this.state.rechargable}
          onColor='green' offColor='#bfbfc4'
          label='' 
          onToggle={rechargable => this.setState({...this.state, rechargable})}
        />
      </View>
    )
  }
}

const Wrapper = ({ children }) => (
  <View style={{
    backgroundColor: 'white', 
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    height: H-120
  }}>
    {children}
  </View>
)
