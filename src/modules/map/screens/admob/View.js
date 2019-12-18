import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import admob, {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
  MaxAdContentRating
} from '@react-native-firebase/admob';
import admobConfig from '~/common/config/admob';

export default class ScreenView extends React.Component {
  state = {
    advert: null,
    unsubscribe: null,
    error: null,
    adMode: this.props.adMode || 'reward'
  }

  async componentDidMount() {
    await admob().setRequestConfiguration({
      setRequestConfiguration: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
    
    const admobConf = Platform.OS === 'ios' ? admobConfig.ios : admobConfig.android;
    var advert = null;
    var unsubscribe = null;
    const mode = this.props.adMode || 'reward';
    console.log('====== AdMob: ', mode, admobConf, TestIds.REWARDED);
    if (mode === 'reward') {
      advert = RewardedAd.createForAdRequest(
        // TestIds.REWARDED,
        admobConf.rewardUnitId,
        {requestNonPersonalizedAdsOnly: true,}
      );
      unsubscribe = advert.onAdEvent((type, error, reward) => {
        if (type === RewardedAdEventType.LOADED) {
          advert.show();
        }
        if (type === RewardedAdEventType.EARNED_REWARD) {
          console.log('=== User earned reward of ', advert);
        }
        if (type === RewardedAdEventType.ERROR || error) {
          console.log('==== reward error: ', error);
          this.setState({error: 'Network error for RewardedAd.'});
        }
      });
    } else {
      advert = InterstitialAd.createForAdRequest(
        admobConf.interstitialUnitId,
        {requestNonPersonalizedAdsOnly: true,}
      );
      unsubscribe = advert.onAdEvent((type, error) => {
        console.log('===== onAdEvent: type: ', type);
        if (type === AdEventType.LOADED) {
          this.setState({error: null}, () => {
            advert.show();
          })
        }
        if (type === AdEventType.ERROR) {
          console.log('===== onAdEvent: error: ', error);
          this.setState({error: 'Network error for InterstitialAd.'});
        }
      });
    }
    advert.load();
    this.setState({advert, unsubscribe})
  }

  onClickScreen = () => {
    const { unsubscribe } = this.state;
    console.log('==== unsubscribe admob');
    unsubscribe()
    Actions['map_first']({initialModal: 'feedback'});
  }

  render() {
    const { _t } = this.props.appActions
    const { error } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={{width: '100%', height:'100%', justifyContent: 'center'}}
          onPress={this.onClickScreen}
        >
          {error && 
            <React.Fragment>
              <Text style={{fontSize: 18, textAlign: 'center'}}>
                {error}
              </Text>
              <Text style={{fontSize: 18, textAlign: 'center'}}>
                {_t("Can't get Admob info. Please try later.")}
              </Text>
            </React.Fragment>
          }
        </TouchableOpacity>
      </View>
    )
  }
}

