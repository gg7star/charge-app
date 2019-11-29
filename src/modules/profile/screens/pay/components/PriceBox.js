import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

export default class PriceBox extends React.Component {
  state = {
    selectedOptionIndex: 0
  }

  render() {
    const { payment } = this.props
    const payment_ = this.props.profile.payment

    return (
      <>
        { payment_ && payment_.cost==payment.cost?
        <View style={{
          backgroundColor: '#5ed8fc',
          borderRadius: 20,
          margin: 5, paddingVertical: 10,
          overflow: 'hidden',
        }}>
          <Image source={require('~/common/assets/images/png/flash.png')}
            style={{
              position: 'absolute', left: 0, top: 0,
              tintColor: 'rgba(255, 255, 255, 0.5)'              
            }}
          />
          <TouchableOpacity onPress={() => this.selectPayPrice(payment)}>
            <Text style={{ 
              width: '100%', textAlign: 'center',
              fontSize: 36, color: '#fff' 
            }} >
              {`${payment.cost}€`}
            </Text>
          </TouchableOpacity>
          {payment.options.map((option, k) => (
            <View style={{              
              marginVertical: 10, paddingHorizontal: 20
            }}>
              <TouchableOpacity onPress={() => {
                this.setState({...this.state, selectedOptionIndex: k})
              }} style={{
                flexDirection: 'row', justifyContent: 'space-between',
              }}>
                <Text style={{ color: 'white', fontSize: 14}}>
                  {option.title}
                </Text>
                {this.state.selectedOptionIndex==k?
                <Image source={require('~/common/assets/images/png/selected.png')}
                  style={{ tintColor: 'white' }}
                />
                :
                <Image source={require('~/common/assets/images/png/select.png')}
                  style={{ tintColor: 'white' }}
                />
                }
              </TouchableOpacity>
            </View>
          ))}
        </View>
        :        
        <View style={{
          backgroundColor: '#f8f8f8',
          borderRadius: 20,
          margin: 5, paddingVertical: 10
        }}>
          <TouchableOpacity onPress={() => this.selectPayPrice(payment)}>
            <Text style={{ 
              width: '100%', textAlign: 'center',
              fontSize: 36, color: '#6a6a7c' 
            }} >
              {`${payment.cost}€`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.selectPayPrice(payment)}>
            <Text style={{ 
              width: '100%', textAlign: 'center',
              fontSize: 15, color: payment.hasBonus?'#35cdfa':'#bfbfc4'
            }}>
              {payment.title}
            </Text>
          </TouchableOpacity>
        </View>
        }
      </>
    )
  }

  selectPayPrice(payment) {
    this.props.profileActions.selectPayPrice(payment)
  }
}
