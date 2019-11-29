import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native'

export default class HistoryListItem extends React.Component {
  
  render() {
    const history = this.props.history;
    return (
      <TouchableOpacity style={{ marginVertical: 13, marginLeft:14 }}
        onPress={this.props.onPress}
      >        
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
          <Text style={{color: '#9F9F9F', fontSize: 17}}>
            {history.date}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 17, marginLeft: 10}}>
              {history.price}
            </Text>
            <Image source={require('~/common/assets/images/png/arrow.png')} 
              style={{
                marginLeft: 20, 
                transform: [{rotate: '180deg'}], 
                tintColor: '#bfbfc4'
              }} 
            />
          </View>
        </View>
      </TouchableOpacity>
          
    )
  }
}