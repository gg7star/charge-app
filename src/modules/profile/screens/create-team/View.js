import React from 'react';
import { View, ScrollView, Image, Text, ImageBackground } from 'react-native';
import { W, H, em } from '~/common/constants';
import Header from './components/Header';
import { Spacer } from '~/common/components';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';

const TITLE_FONT_SIZE = 25;
const DESC_FONT_SIZE = 15;
const SPECIAL_DESC_FONT_SIZE = 18;
const BACKGROUND_IMAGE = require('~/common/assets/images/png/LockDialogBg.png');
const DESCRIPTION_IMAGE = require('~/common/assets/images/png/code-parrainage.png');

export default class ScreenView extends React.Component {
  rednerText = (text, fontSize, isBold) => {
    const { _t } = this.props.appActions;
    var styles = {
      textAlign: 'center',
      fontSize: fontSize ? fontSize : DESC_FONT_SIZE,
      paddingLeft: 30,
      paddingRight: 30 
    };
    if (isBold) {
      styles = {
        ...styles,
        fontWeight: 'bold'
      }
    }
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={styles}>
          {_t(text)}
        </Text>
      </View>
    );
  }

  render() {
    const { _t } = this.props.appActions
    return (
      <Wrapper>
        <Header />
        <View style={{alignCenter: 'center'}}>
          <Spacer size={40} />
          <View style={{alignItems: 'center'}}>
            <Image
              source={DESCRIPTION_IMAGE}
              style={{width: Math.round(W/3), height: Math.round(H/3), flex: 1,
                aspectRatio: 1.5, resizeMode: 'contain'}}
            />
          </View>
          <Spacer size={20} />
          {this.rednerText('Create your team and plant your first tree', TITLE_FONT_SIZE, true)}
          <Spacer size={20} />
          {this.rednerText('Earn points every time you imprint and bring back a battery.')}
          {this.rednerText('Earn more points by viewing the available advertising every 15 minutes on the app.')}
          <Spacer size={25} />
          {this.rednerText('The more you load, the more you plant!', SPECIAL_DESC_FONT_SIZE)}
          <Spacer size={25} />
          {this.rednerText('Then discover through our partner Tree-Nation: what kind of tree you planted, in what part of the world and for what purpose.')}
          <Spacer size={40} />
          {this.rednerText('Invite your friends to join your group by')}
          <Spacer size={20} />
          <View style={{alignCenter: 'center', paddingLeft: 30, paddingRight: 30}}>
            <Spacer size={5} />
            <TouchableScale>
              <LinearGradient
                colors={['#07e28e', '#36f7ad']}
                style={{
                  paddingLeft: 8,
                  paddingRight: 20,
                  borderRadius: 20,
                  alignItems: 'center',
                  // position: 'relative'
                }}
              >
                <Text style={{fontSize: 16, lineHeight: 50, color: 'white'}}>
                  {_t('Create your group')}
                </Text>
              </LinearGradient>
            </TouchableScale>
            <Spacer size={5} />
          </View>
          <Spacer size={40} />
        </View>
      </Wrapper>
    )
  }
}

const Wrapper = (props) => (
  <ScrollView style={{backgroundColor: '#FFFFFF'}}>
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={{flex: 1}}
      resizeMode='cover'
    >
      {props.children}
    </ImageBackground>
  </ScrollView>
)
