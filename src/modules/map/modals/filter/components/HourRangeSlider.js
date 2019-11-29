import React from 'react';
import RangeSlider from 'rn-range-slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class HourRangeSlider extends React.Component {
  enableScroll = () => this.setState({ scrollEnabled: true });
  disableScroll = () => this.setState({ scrollEnabled: false });

  render = () => {
    const { hours, fromHour, toHour } = this.props;
    const { onChangeHours } = this.props;
    const { style } = this.props;

    const min = 0;
    const max = hours.length-1;

    const initialLowValue = hours.indexOf(fromHour);
    const initialHighValue = hours.indexOf(toHour);

    // return (
    //   <MultiSlider
    //     onValuesChangeStart={this.disableScroll}
    //     onValuesChangeFinish={this.enableScroll}
    //   />
    // )
    return (
      <RangeSlider
        style={style} labelStyle={'none'}
        thumbRadius={15} lineWidth={2}
        gravity={'center'}
        min={min} max={max} step={1}
        initialLowValue={initialLowValue} initialHighValue={initialHighValue}
        selectionColor='#fff' blankColor='#62d8fb'
        onValueChanged = {(lowValue, highValue) => {
          const from = hours[lowValue];
          const to = hours[highValue];
          onChangeHours(from, to)
        }}
      />
    )
  }
}