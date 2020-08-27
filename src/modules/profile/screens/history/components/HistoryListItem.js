import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native'
import moment from 'moment';
import { W, H, em } from '~/common/constants';

export default class HistoryListItem extends React.Component {
  
  render() {
    const history = this.props.history;

    return (
      <TouchableOpacity
        style={{ marginVertical: 13, marginLeft:14 }}
        onPress={this.props.onPress}
      >
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#9F9F9F', fontSize: 17}}>
              {moment(history.startTime, 'DD/MM/YY LTS').format('DD/MM/YY LT')}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text style={{color: '#36384A', fontSize: 17, marginLeft: 10}}>
                {history.points ? history.points : 0}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text style={{color: '#36384A', fontSize: 12, marginLeft: 10, alignItems: 'flex-start'}}>
                {'points'}
              </Text>
            </View> */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('~/common/assets/images/png/arrow.png')} 
                style={{
                  marginLeft: 20, 
                  marginRight: 20,
                  transform: [{rotate: '180deg'}], 
                  tintColor: '#bfbfc4',
                  alignItems: 'center'
                }} 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}