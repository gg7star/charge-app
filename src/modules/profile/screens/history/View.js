import React from 'react';
import { ScrollView, Platform, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';
import ProfileHeader from '../../common/headers/ProfileHeader';
import { W, H, em } from '~/common/constants';
import HistoryListItem from './components/HistoryListItem';

export default class ScreenView extends React.Component {
  componentDidMount() {
    this.props.profileActions.loadHistories();    
  }

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  };
  
  goSummary = (index) => {
    this.props.profileActions.selectHistory(index);
    Actions['profile_history_summary']();
  };

  render() {
    const { _t } = this.props.appActions;
    const { histories } = this.props.profile;
    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('History')} onPress={this.goBack} />
        <ScrollView style={{height: Platform.OS=='ios'?(H-60):(H-40)}}>
          {(histories && histories.length > 0) ? 
            histories.map((history, k) => (
              <HistoryListItem history={history} key={k} onPress={() => this.goSummary(k)}/>
            )) :
            <Text style={{color: '#9F9F9F', fontSize: 15, marginLeft: 10}}>
              {_t('Nothing')}
            </Text>
        }
        </ScrollView>
      </ProfileWrapper>
    );
  }
}
