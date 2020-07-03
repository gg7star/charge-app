import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ProfileHeader } from '~/common/components';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';

export default class ScreenView extends React.Component {
  state = {
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Need help ?')} onPress={this.goBack} />
        {this.renderContent()}
      </ProfileWrapper> 
    )
  }

  renderContent() {
    const { _t } = this.props.appActions

    return (
      <View style={{}}>
        <View style={{marginTop: 30, flexDirection: 'row', alignItem: 'center'}}>
          <TouchableOpacity  >
            <Image source={require('~/common/assets/images/png/guide-utilisation.png')} style={{tintColor: '#49D2FB'}}/>
          </TouchableOpacity>
          
          <Text style={{marginLeft: 10, fontSize: 16}}>{_t('User manual')}</Text>
        </View>

        <View style={{marginTop: 30, flexDirection: 'row', alignItem: 'center'}}>
          <TouchableOpacity  >
            <Image source={require('~/common/assets/images/png/signaler-problem.png')} style={{tintColor: '#49D2FB'}}/>
          </TouchableOpacity>
          
          <Text style={{marginLeft: 10, fontSize: 16}}>{_t('to report a problem')}</Text>
        </View>

        <View style={{marginTop: 30, flexDirection: 'row', alignItem: 'center'}}>
          <TouchableOpacity  >
            <Image source={require('~/common/assets/images/png/discutez-avec-nous.png')} style={{tintColor: '#49D2FB'}}/>
          </TouchableOpacity>
          
          <Text style={{marginLeft: 10, fontSize: 16}}>{_t('Chat with us')}</Text>
        </View>

        <View style={{marginTop: 30, flexDirection: 'row', alignItem: 'center'}}>
          <TouchableOpacity  >
            <Image source={require('~/common/assets/images/png/star.png')} style={{tintColor: '#49D2FB', width: 23, height: 23}}/>
          </TouchableOpacity>
          
          <Text style={{marginLeft: 10, fontSize: 16}}>{_t('Notez notre Application ')}</Text>
        </View>
      </View>
    )
  }

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }
}
