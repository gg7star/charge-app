import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { W, H } from '~/common/constants'

export default class PayThanksDialog extends React.Component {
  render() {
    const {_t} = this.props.appActions
    
    return (
      <View style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
        width: W, height: H,
        position: 'absolute', zIndex: 40
      }}>
        <View style={{
          position: 'absolute', zIndex: 50,
          left: 0, bottom: 0,
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          backgroundColor: 'white',
          paddingHorizontal: 20, paddingBottom: 40
        }}>
          <View style={{ alignItems: 'center', paddingVertical: 4 }}>
            <Image source={require('~/common/assets/images/png/slide.png')} />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Image source={require('~/common/assets/images/png/plant.png')} />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ 
              fontSize: 22, color: '#313131', fontWeight: 'bold',
              textAlign: 'center', width: 260, paddingVertical: 5
            }}>
              {_t('You chose to plant a tree.')}
            </Text>  
            <Text style={{ 
              fontSize: 15, color: '#313131', 
              textAlign: 'center', width: 200, paddingVertical: 15
            }}>
              {_t('Nono and his partner Tree-Nation thank you!')}
            </Text>  
            <Text style={{ 
              fontSize: 13, color: '#6a6a7c', 
              textAlign: 'center', width: '100%', paddingVertical: 5
            }}>
              {_t('Enter your email address and see where your tree will be planted.')}
            </Text>  
          </View>
          <View style={{ marginVertical: 10 }}>
            <TextInput placeholder='Email'
              style={{ 
                borderRadius: 10, fontSize: 17, 
                padding: 20, backgroundColor: 'rgba(223, 223, 230, 0.15)'
              }}
            />
          </View>
          <View style={{ marginVertical: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={this.props.onClose}>
              <Text style={{ color: '#35cdfa', fontSize: 17 }}>
                {_t('No thanks')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )    
  }
}
