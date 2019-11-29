import React from 'react'
import DialogWrapper from '../../common/wrappers/DialogWrapper'
import { View, Text } from 'react-native'
import { Spacer } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import ActionBar from './components/ActionBarContainer'
import PlacesList from './components/PlacesListContainer'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions
    const { searchedPlaces } = this.props.map
    const price = 1

    return (
      <DialogWrapper onClose={this.props.onClose}>
        <Text style={{ color: '#313131', fontSize: 22, fontWeight: 'bold', textAlign: 'center'}}>
          {_t('Book your nono')}
        </Text>
        <Spacer size={10} />
        <Text style={{ color: '#313131', fontSize: 14, textAlign: 'center', marginHorizontal: 5}}>
          {`${_t('Your nono battery will be held in the station for a maximum period of 15min for a fee of ')} ${price} €`}
        </Text>
        <Spacer size={20} />
        <PlacesList onSelectPlace={this.props.onSelectPlace} />
        <Spacer size={20} />
        <ActionBar onFinish={this.props.onFinish} />
        <Spacer size={30} />
      </DialogWrapper>
    )
  }
}
