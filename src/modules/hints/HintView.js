import React from 'react';
import { View, Text, Animated } from 'react-native';
import Button from '../../common/components/Button';
import Spacer from '../../common/components/Spacer';
import { colors } from '~/common/constants';
import { em, W, H } from '~/common/constants';

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
  };

  render() {
    const { image, title, desc, nextButtonTitle } = this.props;

    return (
      <View style={styles.container}>
        <Animated.View>
          <Animated.Image
            resizeMode="contain"
            style={styles.image}
            source={image}
          />
        </Animated.View>
        <Animated.View>
          <Text style={styles.title}>
            {title}
          </Text>
          <Spacer size={10*em} />
          <Text style={styles.description}>
            {desc}
          </Text>
          <Spacer size={25*em} />
        </Animated.View>
        <Animated.View>
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

const styles = {
  container: {
    justifyContent: 'space-around'
  },
  image: {
    width: (W-40), height: H/5 * 3, marginVertical: 10
  },
  title: {
    color: '#313131', fontSize: 22, fontWeight: 'bold', textAlign: 'center',
    paddingLeft: 20*em, paddingRight: 20*em
  },
  description: {
    color: '#313131', fontSize: 15, textAlign: 'center',
    paddingLeft: 30*em, paddingRight: 30*em
  }
};
