import React from 'react';
import { ScrollView, Platform, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';
import { ProfileHeader } from '~/common/components';
import { W, H, em } from '~/common/constants';
import NotificationListItem from './components/NotificationListItem';

export default class ScreenView extends React.Component {
  componentDidMount() {
    this.props.profileActions.loadNotifications();
  }

  render() {
    const { _t } = this.props.appActions;
    const { notifications } = this.props.profile;
    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Notifications')} onPress={this.goBack} />
        <ScrollView style={{height: Platform.OS=='ios'? (H-60)*em : (H-40)*em}}>
          {(notifications && (notifications.length > 0)) ?
            notifications.map((notification, k) => (
              <NotificationListItem notification={notification} key={k} onPress={() => this.goSummary(k)}/>
            )) : 
            <Text style={{color: '#9F9F9F', fontSize: 15, marginLeft: 10}}>
              {_t('Nothing')}
            </Text>
          }
        </ScrollView>
      </ProfileWrapper>
    )
  }

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }
  goSummary = (index) => {
    
  }
}
