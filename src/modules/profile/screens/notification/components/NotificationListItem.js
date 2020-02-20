import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

export default class NotificationListItem extends React.Component {
  
  render() {
    const { notification } = this.props;
    const { payload, date } = notification;
    return (
      <TouchableOpacity
        style={{
          marginVertical: 13,
          marginLeft: 14,
        }}
        onPress={this.props.onPress}
      >        
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
          <View style={{justifyContent: 'flex-start'}}>
            <Text style={{fontSize: 17, fontWeight: '500'}}>
              {payload.title}
            </Text>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            <Text style={{color: '#9F9F9F', fontSize: 15, marginLeft: 10}}>
              {date}
            </Text>
          </View>
        </View>
        <View style={{justifyContent: 'flex-start'}}>
          <Text style={{fontSize: 17, color: 'gray', marginTop: 2}}>
            {payload.body}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}