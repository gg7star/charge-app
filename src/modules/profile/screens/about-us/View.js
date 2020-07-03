import React from 'react'
import { TouchableOpacity, View, Text, ScrollView, Image, Linking } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import { ProfileHeader } from '~/common/components';
import { W, H, em } from '~/common/constants';

export default class ScreenView extends React.Component {
  state = {
  }

  onClickSiteUrl = () => {
    Linking.openURL('https://nono-chargeme.com');
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('About us')} onPress={this.goBack} />
        {this.renderContent()}
      </ProfileWrapper>
    )
  }

  renderContent() {
    const { _t } = this.props.appActions
    return (
      <ScrollView style={{ height: H-100 }}>
        <View  style={{ alignItems: 'center' }} >
          <Image source={require('~/common/assets/images/png/logo-color.png')} style={{marginTop: 20}}/>
          <Image source={require('~/common/assets/images/png/Union-32.png')} style={{marginTop: 10, width: 50, height: 10}}/>
        </View>

        <View>
          <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14}}> 
            {_t('Nono is above all the adventure and the project of two students.')}
          </Text>
          <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14}}> 
            {_t('Through the nono service, we wanted to offer a new solution to recharge his laptop in order to accompany and facilitate the daily life of the French.')}
          </Text>
          <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14}}> 
            {_t('Our goal was also to provide an adapted and flexible solution for our partner sites with an added value for their establishment.')}
          </Text>
          <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14}}> 
            {_t('We have developed this activity while trying to deal with the climate issues of our time. This is why we have surrounded ourselves with stakeholders at different levels of our business to make it as environmentally responsible as possible.')}
          </Text>
        </View>

        {/* <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center', top: 15}}>
          <Image source={require('~/common/assets/images/png/Bio-bee-box.png')} style={{margin: 15}} />
          <Image source={require('~/common/assets/images/png/beeandgo.png')} style={{margin: 15}} />
          <Image source={require('~/common/assets/images/png/tree-nation.png')} style={{margin: 15}}/>
        </View>
        <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Image source={require('~/common/assets/images/png/screlec.png')} style={{margin: 15 }}/>
          <Image source={require('~/common/assets/images/png/batribox.png')} style={{margin: 15}}/>
        </View> */}

        <View>
          <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14}}> 
            {_t('Discover more about our partners on our website.')}
          </Text>
          <TouchableOpacity  onPress={this.onClickSiteUrl}>
            <Text style={{textAlign: 'center', marginTop: 15, fontSize: 14, color: '#35CDFA'}}> {_t('nono-chargeme.com')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }
}
