import React from 'react'
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper'
import FilterDialog2Wrapper from '../../common/wrappers/FilterDialog2Wrapper'
import { View, Text } from 'react-native'
import { Spacer } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import ActionBar from '../detail/components/ActionBarContainer'
import PlacesList from '../reserve/components/PlacesListContainer'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { places, searchLimit, place, stationSnList } = this.props.map
    const price = 1

    return (
      <FilterDialog2Wrapper 
        onClose={this.props.onClose} onClear={this.props.onClear} onOpenFilter={this.props.onOpenFilter}
        _t={_t}>
        <Text style={{ color: '#bfbfc4', fontSize: 13 }}>
          {`${_t('Radius of')} ${searchLimit}`}
        </Text>
        <Spacer size={10} />
        <Text style={{ color: '#36384a', fontSize: 22, fontWeight: 'bold' }}>
          {`${stationSnList.length} ${_t('stations')}`}
        </Text>
        <Spacer size={10} />
        <PlacesList onSelectPlace={this.props.onSelectPlace} />
        <Spacer size={20} />
        {place && 
        <ActionBar data={place} onFinish={this.props.onFinish} onReserve={this.props.onReserve}/>
        }
      </FilterDialog2Wrapper>
    )
  }
}
