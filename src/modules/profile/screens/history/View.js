import React from 'react';
import { ScrollView, Platform, Text } from 'react-native';
import Modal from "react-native-modal";
import ProfileWrapper from '../../common/wrappers/ProfileWrapper';
import { ProfileHeader } from '~/common/components';
import { W, H, em } from '~/common/constants';
import HistoryListItemContainer from './components/HistoryListItemContainer';
import HistorySummary from '~/modules/profile/screens/history-summary/ViewContainer';
import moment from 'moment';
import 'moment/min/moment-with-locales';
import 'moment/locale/fr';

export default class HistoryView extends React.Component {
  state = {
    selectedIndex: -1
  }

  componentDidMount() {
    this.props.profileActions.loadHistories();
  }

  goBack = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };
  
  goSummary = (index) => {
    this.setState({ selectedIndex: index});
  };

  handleCloseItem = (index) => {
    this.setState({ selectedIndex: -1 });
  }

  render() {
    const { _t } = this.props.appActions;
    const { histories } = this.props.profile;
    const { selectedIndex } = this.state;
    if (selectedIndex >= 0) {
      console.log('===== histories[selectedIndex]: ', selectedIndex, histories[selectedIndex]);
    }

    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('History')} onPress={this.goBack} />
        <ScrollView style={{height: Platform.OS=='ios'?(H-60):(H-40)}}>
          {(histories && histories.length > 0) ? 
            histories.map((history, k) => (
              <HistoryListItemContainer history={history} key={k} onPress={() => this.goSummary(k)}/>
            )) :
            <Text style={{color: '#9F9F9F', fontSize: 15, marginLeft: 10}}>
              {_t('Nothing')}
            </Text>
        }
        </ScrollView>
        {(selectedIndex >= 0) && <Modal
          isVisible={(selectedIndex >= 0)}
          animationIn={'slideInRight'}
          animationOut={'slideOutLeft'}
          style={{ margin: 0, }}
        >
          <HistorySummary onClose={this.handleCloseItem} history={histories[selectedIndex]} />
        </Modal>}
      </ProfileWrapper>
    );
  }
}
