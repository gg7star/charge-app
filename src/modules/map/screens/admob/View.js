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
import { saveHistory } from '~/common/services/rn-firebase/database';
import { calculateDurationWithMins } from '~/common/utils/time';
import MAP_MODAL from '~/common/constants/map';

const admobConf = Platform.OS === 'ios' ? admobConfig.ios : admobConfig.android;

export default class ScreenView extends React.Component {
  state = {
    advert: null,
    unsubscribe: null,
    error: null,
    status: 'Loading advertising...',
    adMode: this.props.adMode || admobConfig.defaultAdMob
  }

  saveRentHistory = () => {
    const { rent } = this.props;
    console.log('===== saveRentHistory: rent: ', rent);
    // Save history
    const history = {
      ...rent,
      price: "0.00€",
      duration: `${calculateDurationWithMins(rent.startTime, rent.endTime)}`,
      takePlace: rent.depositPlace,
      depositPlace: "",
      cost: 0.00,
      credit: 0,
      points: 123
    };
    console.log('====== saving history');
    saveHistory(history);
  }

  createRewardAdMob = () => {
    var advert = null;
    var unsubscribe = null;
    const { _t } = this.props.appActions;

    advert = RewardedAd.createForAdRequest(
      // TestIds.REWARDED,
      // __DEV__ ? TestIds.REWARDED : admobConf.rewardUnitId,
      admobConf.rewardUnitId,
      {requestNonPersonalizedAdsOnly: true,}
    );

    unsubscribe = advert.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        this.setState({status: _t('Loading reward advertising...'), error: null});
        advert.show();
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        this.setState({status: `${_t('User earned reward of')} ${reward}`, error: null});
        console.log('=== User earned reward of ', reward);
      }
      if (type === RewardedAdEventType.ERROR || error) {
        console.log('==== reward error: ', error);
        this.setState({error: _t('Network error for RewardedAd.'), status: null});
      }
      if (type === RewardedAdEventType.CLOSED) {
        this.setState({error: null, status: null});
        this.onClickScreen();
      }
    });

    return {advert, unsubscribe};
  }

  createInterstitialAdMob = () => {
    var advert = null;
    var unsubscribe = null;
    const { _t } = this.props.appActions;

    advert = InterstitialAd.createForAdRequest(
      // TestIds.INTERSTITIAL,
      // __DEV__ ? TestIds.INTERSTITIAL : admobConf.interstitialUnitId,
      admobConf.interstitialUnitId,
      {requestNonPersonalizedAdsOnly: true,}
    );

    unsubscribe = advert.onAdEvent((type, error) => {
      console.log('===== onAdEvent: type: ', type);
      if (type === AdEventType.LOADED) {
        this.setState({status: _t('Loading interstitial advertising...'), error: null});
        advert.show();
      }
      if (type === AdEventType.OPENED) {
        this.setState({status: _t('Opening interstitial advertising...'), error: null});
      }
      if (type === AdEventType.ERROR) {
        console.log('===== onAdEvent: error: ', error);
        this.setState({error: _t('Network error for InterstitialAd.'), status: null});
      }
      if (type === AdEventType.CLOSED) {
        this.setState({error: null, status: null});
        this.onClickScreen();
      }
    });

    return {advert, unsubscribe};
  }

  async componentDidMount() {
    const { _t } = this.props.appActions;
    this.saveRentHistory();

    await admob().setRequestConfiguration({
      setRequestConfiguration: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });

    var adverts = null;
    const mode = this.props.adMode || admobConfig.defaultAdMob;
    console.log('====== AdMob: ', mode, admobConf, TestIds.INTERSTITIAL, TestIds.REWARDED);
    if (mode === 'reward') {
      adverts = this.createRewardAdMob();
    } else if (mode === 'interstitial') {
      adverts = this.createInterstitialAdMob();
    } else {
      return;
    }
    const { advert, unsubscribe } = adverts;
    advert.load();
    this.setState({advert, unsubscribe});
  }

  onClickScreen = () => {
    const { mapActions } = this.props;
    const { unsubscribe } = this.state;
    console.log('==== unsubscribe admob');
    unsubscribe && unsubscribe();
    mapActions.setViewedAdmob(true);
    // mapActions.setActiveModal(MAP_MODAL.RENT);
    Actions['map_first']();
  }

  render() {
    const { _t } = this.props.appActions;
    const { error, status } = this.state;
    return (
      <View
        style={{
          width: '100%',
          height:'100%',
          backgroundColor: '#000',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <View style={{justifyConetnet: 'center'}}>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={this.onClickScreen}
          >
            {status && 
              <React.Fragment>
                <Text style={{fontSize: 18, textAlign: 'center', color: '#FFF'}}>
                  {_t(status)}
                </Text>
              </React.Fragment>
            }
            {error && 
              <React.Fragment>
                <Text style={{fontSize: 18, textAlign: 'center', color: '#FFF'}}>
                  {error}
                </Text>
                <Text style={{fontSize: 18, textAlign: 'center', color: '#FFF'}}>
                  {_t("Can't get Admob info. Please try later.")}
                </Text>
              </React.Fragment>
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

