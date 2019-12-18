import React from 'react'
import { ScrollView, Platform, View, Image, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ProfileWrapper from '../../common/wrappers/ProfileWrapper'
import ProfileHeader from '../../common/headers/ProfileHeader'
import { W, H, em } from '~/common/constants';
import LinearGradient from 'react-native-linear-gradient'

export default class ScreenView extends React.Component {
  componentDidMount() {
    this.props.profileActions.loadHistories();    
  }

  render() {
    const { _t } = this.props.appActions;
    const { history } = this.props.profile;
    return (
      <ProfileWrapper>
        <ProfileHeader title={_t('Summary')} onPress={this.goBack} />
        {history &&
        <>
          {this.renderSummaryTable()}
          {this.renderConsumeTable()}
        </>
        }
      </ProfileWrapper>
    )
  }

  renderSummaryTable() {
    const { _t } = this.props.appActions
    const { history } = this.props.profile
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 50*em, marginTop: 10 }}>
            <Image source={require('~/common/assets/images/png/hours.png')}
              style={{tintColor: '#35cdfa'}}
            />
          </View>
          <View style={{ width: 290*em }}>
            <Text style={{ color: '#bfbfc4', marginBottom: 5}}>
              {_t('Duration')}
            </Text>
            <Text style={{ color: '#36384a', fontSize: 36, }}>
              {history.duration}
            </Text>
          </View> 
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ width: 50*em, marginTop: 10 }}>
            <Image source={require('~/common/assets/images/png/line21.png')}
              style={{tintColor: '#35cdfa'}}
            />
          </View>
          <View style={{ width: 290*em }}>
            <Text style={{ color: '#bfbfc4', mfontSize: 15, arginBottom: 5}}>
              {_t('Place of taking')}
            </Text>
            <Text style={{ color: '#36384a', fontSize: 17, marginBottom: 30 }}>
              {history.fromPlace}
            </Text>
            <Text style={{ color: '#bfbfc4', fontSize: 15, marginBottom: 5}}>
              {_t('Place of deposit')}
            </Text>
            <Text style={{ color: '#36384a', fontSize: 17,  }}>
              {history.toPlace}
            </Text>
          </View> 
        </View>
      </View>
    )
  }

  renderConsumeTable() {
    const { history } = this.props.profile
    const { _t } = this.props.appActions

    return (
      <View style={{
        position: 'absolute', bottom: 0, left: 0, zIndex: 30,
        width: W, 
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        backgroundColor: '#fff',    
        overflow: 'hidden'
      }}>
        <LinearGradient
          start={{ x:1, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#ffdf00', '#ff52a8']}      
        >
          <View style={{
            alignItems: 'center', justifyContent: 'center', 
            paddingVertical: 8
          }}>
            <Image source={require('~/common/assets/images/png/slide.png')} 
              style={{
                tintColor: '#fff'
              }}
            />
          </View>
          <View style={{
            paddingHorizontal: 20, 
            paddingBottom: 40
          }}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ 
                fontSize: 26, fontWeight: 'bold', color: '#fff'
              }}>
                {_t('Consumption')}
              </Text>
            </View>
            <View style={{ 
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 5
            }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {_t('Time')}
              </Text>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {history.duration}
              </Text>
            </View>
            <View style={{ 
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 5
            }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {_t('Cost')}
              </Text>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {history.cost+' €'}
              </Text>
            </View>
            <View style={{ 
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 5
            }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {_t('Credits')}
              </Text>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {history.credit+' €'}
              </Text>
            </View>
            <View style={{ 
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 25
            }}>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {_t('TOTAL')}
              </Text>
              <Text style={{ fontSize: 17, color: '#fff' }}>
                {`${history.credit+history.cost} €`}
              </Text>
            </View>
          </View>
        </LinearGradient>    
      </View>
    )
  }

  goBack = () => {
    Actions.map();
    Actions['map_first']({profileOpened: true});
  }
}
