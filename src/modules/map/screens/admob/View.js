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
import { saveHistory } from '~/common/services/rn-firebase/database';
import { calculateDurationWithMins } from '~/common/utils/time';
import MAP_MODAL from '~/common/constants/map';

export default class ScreenView extends React.Component {
  state = {
    advert: null,
    unsubscribe: null,
    error: null,
    status: 'Loading advertising...',
    adMobSettings: null
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
    const adMobSettings = this.props.admob.settings || null;
    if (adMobSettings) {
      const admobConf = Platform.OS === 'ios' ? adMobSettings.ios : adMobSettings.android;
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
    return null;
  }

  createInterstitialAdMob = () => {
    var advert = null;
    var unsubscribe = null;
    const { _t } = this.props.appActions;
    const adMobSettings = this.props.admob.settings || null;
    if (adMobSettings) {
      const admobConf = Platform.OS === 'ios' ? adMobSettings.ios : adMobSettings.android;
      console.log('====== admobConf: ', admobConf, admobConf.interstitialUnitId)
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
    return null;
  }

  async componentDidMount() {
    const { _t } = this.props.appActions;
    const admobProps = this.props.admob;
    this.saveRentHistory();
    console.log('==== admobProps: ', admobProps)
    if (!admobProps || !admobProps.settings) {
      console.log('===== empty admob');
      return;
    }

    await admob().setRequestConfiguration({
      setRequestConfiguration: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });

    var adverts = null;
    const adMobSettings = admobProps.settings;
    const mode = admobProps.settings.defaultAdMob;
    console.log('====== AdMob: ', mode, adMobSettings, TestIds.INTERSTITIAL, TestIds.REWARDED);
    if (mode === 'reward') {
      adverts = this.createRewardAdMob();
    } else if (mode === 'interstitial') {
      adverts = this.createInterstitialAdMob();
    } else {
      return;
    }
    if (adverts) {
      const { advert, unsubscribe } = adverts;
      advert.load();
      this.setState({advert, unsubscribe});
    }
  }

  onClickScreen = () => {
    const { mapActions, admobActions } = this.props;
    const { unsubscribe } = this.state;
    console.log('==== unsubscribe admob');
    unsubscribe && unsubscribe();
    mapActions.setViewedAdmob(true);
    admobActions.hideAdmob();
    // mapActions.setActiveModal(MAP_MODAL.RENT);
    Actions['map']();
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
        <View style={{ justifyConetnet: 'center', flex: 1}}>
          <TouchableOpacity
            style={{justifyContent: 'center', flex: 1}}
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

