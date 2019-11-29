import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { em } from '~/common/constants'

export default class DetailInfo extends React.Component {
  state = {
    openHoursToggled: false
  }

  render() {
    const { _t } = this.props.appActions
    const { data } = this.props

    return (
      <View>
        {this.renderSummary()}

        <View style={styles.row}>
          <View style={styles.col1}>
            <Image source={require('~/common/assets/images/png/marker.png')} 
              style={{tintColor: '#5ed8fc'}}              
            />
          </View>
          <View style={styles.col2}>
            <Text style={{ fontSize: 16 }}>
              {data.location}
            </Text>
            <Text style={{ fontSize: 16, color: '#c9c9ce'}}>
              {data.exactDistance}
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
            {this.state.openHoursToggled ?
            <React.Fragment>
              {data.openHours.map((openHourData, k) => (
                <View style={{flexDirection: 'row', marginVertical: 5}} key={k}>
                  <View style={{width: 100*em}}>
                    <Text style={{fontSize: 17}}>
                      {_t(openHourData.day)}
                    </Text>
                  </View>
                  <View style={{width: 200*em}}>                    
                    {
                    openHourData.notOpen?
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
              ))}
            </React.Fragment>            
            :
            <View style={{}}>
              <TouchableOpacity onPressOut={this.openHoursToggle} style={{
                flexDirection: 'row'
              }}>
                <Text style={{ fontSize: 16, color: '#36384a'}}>
                  {`${_t('Open')} ${_t('Closed')} ${_t('at')} ${data.openHour}`}
                </Text>
              
                <Image source={require('~/common/assets/images/png/arrow2.png')} 
                  style={{ marginLeft: 10, marginTop: 6 }}
                />
              </TouchableOpacity>
            </View>
            }            
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
      </View>
    )
  }

  renderSummary() {
    const { _t } = this.props.appActions
    const { data } = this.props

    return (
      <View style={{
        flexDirection: 'row', marginVertical: 20
      }}> 
        <View>
          <Image source={{ uri: data.image }} style={{
            width: 40, height: 40,
            borderRadius: 10
          }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{
            color: '#36384a', fontSize: 17, fontWeight: 'bold'
          }}>
            {data.title}
          </Text>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{ color: '#1be497' }}>
              {_t('Open')}
            </Text>
            <Text style={{ color: '#c9c9ce'}}>
              {` ${_t('Closed')} ${_t('at')} ${data.openHour}`}
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

  openHoursToggle = () => {
    this.setState({
      ...this.state,
      openHoursToggled: true
    })
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', marginVertical: 15
  },
  col1: {
    width: 50*em, alignItems: 'flex-start'
  },
  col2: {
    width: 250*em, alignItems: 'flex-start'
  }
})
