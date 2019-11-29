import React from 'react'
import FeedbackDialogWrapper from '../../common/wrappers/FeedbackDialogWrapper'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Button, Spacer } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import StarRating from 'react-native-star-rating'

export default class Dialog extends React.Component {
  state = {
    adjust: {
      marginBottom: 0
    },
    status: 'until',
    rating: 0
  }
  render() {
    const { _t } = this.props.appActions
    const { place } = this.props.map
    const { status } = this.state

    return (
      <FeedbackDialogWrapper>
        <View style={{marginBottom: this.state.adjust.marginBottom}}>
          {status=='until' &&
          this.renderWhenUntil()
          }
          {(status=='rated' || status=='write_review') &&
          this.renderWhenRated()
          }
        </View>
      </FeedbackDialogWrapper>
    )
  }

  renderWhenUntil() {
    const { _t } = this.props.appActions
    const { rating, } = this.state

    return (
      <React.Fragment>
        <View style={{ alignItems: 'center' }}>
          <Image source={require('~/common/assets/images/png/logo-color.png')} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 22, fontWeight: 'bold', textAlign: 'center',
            marginVertical: 10, marginHorizontal: 20
          }}>
            {_t('Do you like our service?')}
          </Text>
          <Text style={{
            fontSize: 15, lineHeight: 22, textAlign: 'center',
            marginHorizontal: 40
          }}>
            {_t('Click on the stars to rate our application.')}
          </Text>
        </View>
        <View style={{ 
          alignItems: 'center', 
          marginVertical: 20, marginHorizontal: 10
        }}>
          <StarRating
            starSize={30}
            selectedStar={this.setRating}
            rating={rating}
            fullStarColor='#ffdf00' emptyStarColor='#bfbfc4'
          />
        </View>
        <View style={{ 
          alignItems: 'center', 
          marginVertical: 10
        }}>
          <TouchableOpacity onPress={this.props.onClose}>
            <Text style={{
              fontSize: 17, color: colors.primary, textAlign: 'center'
            }}>
              {_t('Later')}
            </Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    )
  }

  renderWhenRated() {
    const { _t } = this.props.appActions
    const { rating, status } = this.state

    return (
      <React.Fragment>
        <View style={{ alignItems: 'center' }}>
          {rating>3?
          <Image source={require('~/common/assets/images/png/happy-nono.png')} />
          :
          <Image source={require('~/common/assets/images/png/nono.sad.png')} />
          }
          
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 22, fontWeight: 'bold', textAlign: 'center',
            marginVertical: 10, marginHorizontal: 20
          }}>
            {rating>3?
            _t('Do you like our service?')
            :
            _t('We are sorry.')
            }
          </Text>
        </View>
        <View style={{ 
          alignItems: 'center', 
          marginVertical: 20, marginHorizontal: 10
        }}>
          <StarRating
            starSize={30} disabled={true}
            rating={rating}
            fullStarColor='#ffdf00' emptyStarColor='#bfbfc4'
          />
        </View>
        <View style={{ 
          alignItems: 'center', 
          marginVertical: 10
        }}>
          {status=='rated'?
          <TouchableOpacity onPress={() => this.setState({...this.state, status: 'write_review'})}>
            <Text style={{
              fontSize: 13, color: colors.primary, textAlign: 'center'
            }}>
              {_t('Write a comment')}
            </Text>
          </TouchableOpacity>
          :
          <TextInput style={{
            borderRadius: 20, width: '100%', height: 90,
            backgroundColor: 'rgba(191, 191, 196, 0.1)', color: '#9f9f9f',
            textAlign: 'center', fontSize: 15
          }} 
            onFocus={this.adjustOnFocus} onBlur={this.adjustOnBlur}
          />
          }
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{width: 180}}>
            <Button 
              caption={_t('Send')}
              icon={require('~/common/assets/images/png/send.png')} iconColor='#fff'
              textColor='#fff' bgColor='#35cdfa'
              containerHeight={50}
              onPress={this.sendRate}
            />
          </View>
        </View>
      </React.Fragment>
    )
  }

  setRating = (rating) => {
    this.setState({
      ...this.state,
      rating,
      status: 'rated'
    })
  }

  adjustOnFocus = () => {
    console.log('asdasd')
    this.setState({...this.state, adjust: {marginBottom: 280}})
  }

  adjustOnBlur = () => {
    this.setState({...this.state, adjust: {marginBottom: 0}})
  }

  sendRate = () => {
    Actions['map_first']()
  }
}
