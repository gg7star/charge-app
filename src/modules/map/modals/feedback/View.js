import React from 'react';
import FeedbackDialogWrapper from '../../common/wrappers/FeedbackDialogWrapper';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Spacer } from '~/common/components';
import { colors, W, H } from '~/common/constants';
import StarRating from 'react-native-star-rating';
import MAP_MODAL from '~/common/constants/map';
import { saveRate } from '~/common/services/rn-firebase/database';
import moment from 'moment';

export default class Dialog extends React.Component {
  state = {
    adjust: {
      marginBottom: 0
    },
    status: 'until',
    rating: 0,
    enabledComment: false,
    comment: null,
  }

  adjustOnFocus = () => {
    console.log('asdasd')
    this.setState({...this.state, adjust: {marginBottom: 280}})
  }

  adjustOnBlur = () => {
    this.setState({...this.state, adjust: {marginBottom: 0}})
  }

  sendRate = async () => {
    const { mapActions, rentActions, rent } = this.props;
    const { rating, comment } = this.state;
    const rate = {
      rating,
      comment,
      rent,
      date: moment().format('DD/MM/YY LTS'),
    }
    await saveRate(rate);

    mapActions.setActiveModal(MAP_MODAL.UNLOCK);
    rentActions.rentInit();
  }

  renderComment = () => {
    const { _t } = this.props.appActions;
    const { enabledComment, rating } = this.state;
    if (enabledComment) {
      return (
        <TextInput
          style={{
            borderRadius: 20, width: '100%', height: 90,
            backgroundColor: 'rgba(191, 191, 196, 0.1)',
            color: '#9f9f9f',
            textAlign: 'center', fontSize: 15
          }} 
          onFocus={this.adjustOnFocus}
          onBlur={this.adjustOnBlur}
          onChangeText={comment => this.setState({comment})}
        />
      )
    } else {
      if (rating > 0 ) {
        return (
          <TouchableOpacity onPress={() => this.setState({enabledComment: true})}>
            <Text style={{fontSize: 13, color: colors.primary, textAlign: 'center'}}>
              {_t('Write a comment')}
            </Text>
          </TouchableOpacity>
        );
      } else {
        <View />
      }
    }
  };

  renderRatingImage = () => {
    const { rating } = this.state;
    if (rating > 3) return <Image source={require('~/common/assets/images/png/happy-nono.png')} />
    if (rating === 0) return <Image source={require('~/common/assets/images/png/happy-nono.png')} />
    return <Image source={require('~/common/assets/images/png/nono.sad.png')} />
  };

  renderTitle = () => {
    const { _t } = this.props.appActions;
    const { rating } = this.state;
    if ((rating > 3) || (rating === 0)) return _t('Do you like our service?');
    return _t('We are sorry.');
  };

  setRating = (rating) => {
    this.setState({
      ...this.state,
      rating,
      status: 'rated'
    })
  }

  renderWhenRated = () => {
    const { _t } = this.props.appActions;
    const { rating } = this.state;

    return (
      <React.Fragment>
        <View style={{ alignItems: 'center' }}>
          {this.renderRatingImage()}
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 22, fontWeight: 'bold', textAlign: 'center',
            marginVertical: 10, marginHorizontal: 20
          }}>
            {this.renderTitle()}
          </Text>
          {rating === 0 && <Text style={{
              fontSize: 15, lineHeight: 22,
              textAlign: 'center', marginHorizontal: 40
            }}>
              {_t('Click on the stars to rate our application.')}
            </Text>
          }
        </View>
        <View style={{alignItems: 'center', marginVertical: 20, marginHorizontal: 10}}>
          <StarRating
            starSize={30}
            selectedStar={this.setRating}
            rating={rating}
            fullStarColor='#ffdf00' emptyStarColor='#bfbfc4'
          />
        </View>
        <View style={{alignItems: 'center', marginVertical: 10}}>
          {this.renderComment()}
        </View>
        <View style={{alignItems: 'center'}}>
          { rating > 0 ? (
            <View style={{width: 180}}>
              <Button 
                caption={_t('Send')}
                icon={require('~/common/assets/images/png/send.png')} iconColor='#fff'
                textColor='#fff' bgColor='#35cdfa'
                containerHeight={50}
                onPress={this.sendRate}
              />
            </View>
          ) : (
            <View style={{alignItems: 'center', marginVertical: 10}}>
              <TouchableOpacity onPress={this.props.onClose}>
                <Text style={{fontSize: 17, color: colors.primary, textAlign: 'center'}}>
                  {_t('Later')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </React.Fragment>
    )
  }

  render() {
    const { _t } = this.props.appActions
    const { place } = this.props.map
    const { status } = this.state

    return (
      <FeedbackDialogWrapper>
        <View style={{marginBottom: this.state.adjust.marginBottom}}>
          {this.renderWhenRated()}
        </View>
      </FeedbackDialogWrapper>
    )
  }
}
