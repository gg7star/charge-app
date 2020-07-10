import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { em } from '~/common/constants';

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 47*em,
    height: 47*em,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    // borderColor: '#00000030',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
    paddingTop: 5,
    color: "#FFFFFF"
  },
  focusCell: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
});

const CELL_COUNT = 6;

const ConfirmCodeField = ({onFulfill}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onChangeText = (code) => {
    console.log('====== onChangeText: code: ', code);
    setValue(code);
    onFulfill(code);
  };


  return (
    <View>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onChangeText}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    </View>
  );
};

export default ConfirmCodeField;
