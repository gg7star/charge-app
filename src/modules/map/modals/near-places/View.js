import React from 'react';
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper';
import FilterDialog2Wrapper from '../../common/wrappers/FilterDialog2Wrapper';
import { View, Text } from 'react-native';
import { Spacer } from '~/common/components';
import { colors, W, H } from '~/common/constants';
import ActionBar from '../detail/components/ActionBarContainer';
import PlacesList from '../reserve/components/PlacesListContainer';
import { Button } from '~/common/components';

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions;
    const { places, searchLimit, place, direction, stationSnList } = this.props.map;
    const price = 1;
    return (
      <FilterDialog2Wrapper 
        onClose={this.props.onClose}
        onClear={this.props.onClear}
        onOpenFilter={this.props.onOpenFilter}
        _t={_t}
      >
        <Text style={{ color: '#bfbfc4', fontSize: 13 }}>
        </Text>
        <Spacer size={10} />
        <PlacesList onSelectPlace={this.props.onSelectPlace}/>
        <Spacer size={10} />
        {place && 
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              icon={require('~/common/assets/images/png/go.png')} iconColor='#fff'
              textColor='#fff'
              bgGradientStart='#ff52a8' bgGradientEnd='#ffdf00'
              caption={
                direction.duration ? 
                `Go ${direction.duration} - ${direction.distance}` 
                : _t('Not sure')
              }
              onPress={() => this.props.onFinish()}
            />
          </View>
        }
      </FilterDialog2Wrapper>
    )
  }
}
