import React from 'react';
import { View } from 'native-base';
import { em } from '~/common/constants'

const Spacer = ({ size }) => (
  <View style={{ height: size*em }} />
);

Spacer.defaultProps = {
  size: 20*em,
};

export default Spacer;
