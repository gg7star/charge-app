import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DropDownItem from "react-native-drop-down-item";
import { em } from '~/common/constants';
import { openHourStatus } from '~/common/utils/time';

export default class DetailInfo extends React.Component {
  state = {}
  
  renderSummary = () => {
    const { _t } = this.props.appActions
    const { data } = this.props
    const hourStatus = openHourStatus(data.openHours);

    return (
      <View style={{
        flexDirection: 'row', marginVertical: 20
      }}> 
        <View>
          <Image source={{ uri: data.image }} style={styles.image} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>
            {data.title}
          </Text>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{ color: (hourStatus.openStatus ? '#1be497' : '#c9c9ce') }}>
              {hourStatus.openStatus
                ? `${_t('Opened at')} ${hourStatus.hour}`
                : `${_t('Closed at')} ${hourStatus.hour}`
              }
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{color: '#35cdfa'}}>
              {`${data.batteries} batteries ${data.places} places`}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderOpenHours = () => {
    const { _t } = this.props.appActions
    const { data } = this.props
    const hourStatus = openHourStatus(data.openHours);

    return (
      <DropDownItem
        contentVisible={false}
        invisibleImage={require('~/common/assets/images/png/arrow2.png')}
        visibleImage={require('~/common/assets/images/png/arrow2.png')}
        header={
          <View style={{flexDirection: 'row'}}>
            <Text style={{ fontSize: 16, color: (hourStatus.openStatus ? '#36384a' : '#c9c9ce')}}>
              {hourStatus.openStatus
                ? `${_t('Opened at')} ${hourStatus.hour}`
                : `${_t('Closed at')} ${hourStatus.hour}`
              }
            </Text>

            <Image source={require('~/common/assets/images/png/arrow2.png')} 
              style={{ marginLeft: 10, marginTop: 6 }}
            />
          </View>
        }
      >
        <React.Fragment>
          {data.openHours.map((openHourData, k) => {
            if(openHourData) {
              return (
                <View style={{flexDirection: 'row', marginVertical: 5}} key={k}>
                  <View style={{width: 100*em}}>
                    <Text style={{fontSize: 17}}>
                      {_t(openHourData.day)}
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
          })}
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
      subAddress = `Located in ${address.split(',')[0]}`;
    } else {
      address = data.description ? data.description : data.title;
      subAddress = `${data.coordinate.latitude}, ${data.coordinate.longitude}`
    }

    return (
      <ScrollView  style={{ alignSelf: 'stretch' }}>
        {this.renderSummary()}
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/marker.png')} 
              style={{tintColor: '#5ed8fc'}}              
            />
          </View>
          <View style={styles.col2}>
            <Text style={{ fontSize: 16 }}>
              {address}
            </Text>
            <Text style={{ fontSize: 16, color: '#c9c9ce', marginTop: 10}}>
              {subAddress}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/hours.png')} 
              style={{tintColor: '#5ed8fc'}}              
            />
          </View>
          <View style={styles.col2}>
            {this.renderOpenHours()}        
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/call.png')} 
              style={{tintColor: '#5ed8fc'}}              
            />
          </View>
          <View style={styles.col2}>
            <Text style={{fontSize: 17}}>
              {data.phone}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/website.png')} 
              style={{tintColor: '#5ed8fc'}}              
            />
          </View>
          <View style={styles.col2}>
            <Text style={{fontSize: 17}}>
              {data.web}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
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
        </View>
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
    width: 40,
    height: 40,
    borderRadius: 10
  },
  title: {
    color: '#36384a',
    fontSize: 17,
    fontWeight: 'bold'
  }
})
