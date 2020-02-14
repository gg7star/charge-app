import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { colors } from '~/common/constants';
import styles from './styles';

const MenuItem = (props) => (
  <TouchableOpacity
    style={styles.container}
    disabled={props.disabled}
    onPress={props.onPress}
  >
    <View style={styles.titleContainer}>
      <Image
        source={props.image}
        style={[
          styles.rightImage,
          { opacity: props.disabled ? 0.5: 1 }
        ]}
      />
      <Text style={[styles.title, {color: props.disabled ? '#BFBFC4' : '#36384A'}]}>
        {props.title}
      </Text>
    </View>
    <View>
      {props.subtitle &&
        <Text style={[styles.subTitle, {color: props.disabled ? '#BFBFC4' : '#36384A'}]}>
          {props.subtitle}
        </Text>
      }
    </View>
  </TouchableOpacity>
)

export default MenuItem
