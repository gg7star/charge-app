import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Button, Spacer } from '~/common/components'
import { colors } from '~/common/constants'
import { em, W } from '~/common/constants'

export default class HintView extends React.Component {
  state = {
    anim: new Animated.Value(0),
  };

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  render() {
    const { image, title, desc, nextButtonTitle } = this.props;

    return (
      <View style={{ justifyContent: 'space-around' }}>
        <View style={{}}>
          <Animated.Image
            resizeMode="contain"
            style={{ width: (W-40), height: 527/425*(W-40), marginVertical: 20 }}
            source={image}
          />
        </View>
        <Animated.View
          style={{}}
        >
          <Text style={{ color: '#313131', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
            {title}
          </Text>
          <Spacer size={10*em} />
          <Text style={{ color: '#313131', fontSize: 15, textAlign: 'center' }}>
            {desc}
          </Text>
          <Spacer size={25*em} />
          <Button
            bgColor={colors.primaryBackground}
            textColor={'white'}
            caption={nextButtonTitle}
            onPress={this.props.onGoNext}
          />
        </Animated.View>
      </View>
    );
  }
}
