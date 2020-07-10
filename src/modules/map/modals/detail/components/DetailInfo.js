import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import DropDownItem from "react-native-drop-down-item";
import moment from 'moment';
import { em } from '~/common/constants';
import { openHourStatus } from '~/common/utils/time';
import { getStationStatus } from '~/common/utils/stationStatus';

export default class DetailInfo extends React.Component {
  state = {}
  
  onClickWeb = (link) => {
    const prefixHttps = 'https://';
    const prefixHttp = 'http://';
    if ((link.substring(0, prefixHttps.length) === prefixHttps) ||
      (link.substring(0, prefixHttp.length) === prefixHttp)
    ) {
      Linking.openURL(link);
    } else {
      Linking.openURL(`${prefixHttps}${link}`);
    }
  }

  onClickPhoneNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
  }

  renderSummary = () => {
    const { _t } = this.props.appActions
    const { data } = this.props
    const hourStatus = openHourStatus(data.openHours);
    const { batterries, places } = getStationStatus(data.stations_status);

    return (
      <View style={{flexDirection: 'row', marginVertical: 20}}> 
        <View>
          <Image source={{ uri: data.image }} style={styles.image} />
        </View>
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={styles.title}>
            {data.title}
          </Text>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{ color: (hourStatus.openStatus ? '#1be497' : '#c9c9ce'), fontSize: 17 }}>
              {hourStatus.openStatus ? `${_t('Opened')}` : `${_t('Closed')}`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
              <Text style={{color: '#35cdfa', fontWeight: '500', fontSize: 17}}>
                {`${batterries} ${_t('batteries')}`}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
              <Text style={{color: '#35cdfa', fontWeight: '500', fontSize: 17}}>
                {`${places} ${_t('places')}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderOpenHours = () => {
    const { _t } = this.props.appActions;
    const { data } = this.props;
    const openHours = data.openHours;
    const hourStatus = openHourStatus(openHours);

    return (
      <DropDownItem
        contentVisible={false}
        invisibleImage={require('~/common/assets/images/png/arrow2.png')}
        visibleImage={require('~/common/assets/images/png/arrow2.png')}
        header={
          <View style={{flexDirection: 'row'}}>
            <Text style={{ fontSize: 16, color: (hourStatus.openStatus ? '#36384a' : '#c9c9ce')}}>
              {hourStatus.openStatus ? `${_t('Opened')}` : `${_t('Closed')}`}
            </Text>
            <Image source={require('~/common/assets/images/png/arrow2.png')} 
              style={{ marginLeft: 10, marginTop: 6 }}
            />
          </View>
        }
      >
        <React.Fragment>
          {hourStatus ? openHours.map((openHourData, k) => {
              if(openHourData) {
                return (
                  <View style={{flexDirection: 'row', marginVertical: 5}} key={k}>
                    <View style={{width: 100*em}}>
                      <Text style={{fontSize: 17}}>
                        {_t(moment.weekdays(openHourData.week_day))}
                      </Text>
                    </View>
                    <View style={{width: 200*em}}>
                      {
                        openHourData.notOpen ?
                          <Text style={{color: '#bfbfc4', fontSize: 17}}>
                            {_t('Closed')}
                          </Text>
                        :
                          <Text style={{color: '#36384a', fontSize: 17}}>
                            {`${openHourData.openHour} - ${openHourData.closeHour}`}
                          </Text>
                      }
                    </View>
                  </View>
                );
              }
            }) : (
              <View/>
            )
          }
        </React.Fragment>
      </DropDownItem>
    );
  }

  render() {
    const { _t } = this.props.appActions
    const { data, distance } = this.props
    var address = '';
    var subAddress = '';
    if (data.address) {
      address = data.address;
      subAddress = data.description;
    } else {
      address = data.description ? data.description : data.title;
      subAddress = data.location; //`${data.coordinate.latitude}, ${data.coordinate.longitude}`
    }
    
    return (
      <ScrollView  style={{ alignSelf: 'stretch' }}>
        {this.renderSummary()}
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('~/common/assets/images/png/marker.png')} 
              style={{tintColor: '#5ed8fc'}}
            />
          </View>
          <View style={styles.col2}>
            <Text style={{ fontSize: 16 }}>
              {address}
            </Text>
            <Text
              style={{ fontSize: 16, color: '#c9c9ce', marginTop: 10}}>
              {subAddress}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('~/common/assets/images/png/hours.png')} 
              style={{tintColor: '#5ed8fc'}}
            />
          </View>
          <View style={styles.col2}>
            { (data.openHours && (data.openHours.length > 0)) ? this.renderOpenHours() : <Text style={{fontSize: 17}}>
              {_t('None')}
            </Text>}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/call.png')} 
              style={{tintColor: '#5ed8fc'}}
            />
          </View>
          <View style={styles.col2}>
            <TouchableOpacity onPress={() => this.onClickPhoneNumber(data.phone)}>
              <Text style={{fontSize: 17}}>
                {data.phone}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('~/common/assets/images/png/website.png')} 
              style={{tintColor: '#5ed8fc'}}
            />
          </View>
          <View style={styles.col2}>
            <TouchableOpacity onPress={() => this.onClickWeb(data.web)}>
              <Text style={{fontSize: 17}}>
                {data.web}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/share.png')} 
              style={{tintColor: '#5ed8fc'}}
            />
          </View>
          <View style={styles.col2}>
            <Text style={{fontSize: 17}}>
              {_t('Share')}
            </Text>
          </View>
        </View> */}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 15
  },
  col1: {
    width: 50*em,
    alignItems: 'flex-start'
  },
  col2: {
    width: 250*em,
    alignItems: 'flex-start'
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10
  },
  title: {
    color: '#36384a',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
