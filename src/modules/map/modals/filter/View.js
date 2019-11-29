import React from 'react'
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper'
import FilterDialogWrapper from '../../common/wrappers/FilterDialogWrapper'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Spacer, Button } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import ToggleSwitch from 'toggle-switch-react-native'
import HourRangeSlider from './components/HourRangeSlider'

export default class Dialog extends React.Component {
  state = {
    filterOpened: false,
    fromHour: '12:00', toHour: '19:00'
  }

  render() {
    const { _t } = this.props.appActions
    const { places, searchLimit, place } = this.props.map    

    return (
      <FilterDialogWrapper 
        onClear={this.props.onClear} 
        _t={_t}
      >
        <Spacer size={20} />
        {this.renderToggleOpened()}        
        <Spacer size={20} />        
        {this.renderHoursSlider()}
        <Spacer size={20} />
        {this.renderActionBar()}        
      </FilterDialogWrapper>
    )
  }

  renderHoursSlider() {
    const { _t } = this.props.appActions

    const { fromHour, toHour } = this.state    
    let hours = []
    for (let i=7;i<=22;i++) {
      let hour = i+':00'
      hours.push(hour)
    }

    return (
      <View>
        <View>
          <Text style={{ fontSize: 17, color: '#fff' }}>
            {_t('Open from ')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, color: '#fff'}}>
            {fromHour}
          </Text>
          <Text style={{ fontSize: 17, color: '#fff'}}>
            {toHour}
          </Text>
        </View>
        <View>
          <HourRangeSlider hours={hours} onChangeHours={(fromHour, toHour) => {
              this.setState({...this.state, fromHour, toHour})
            }}
            fromHour={fromHour} toHour={toHour}
            style={{width: W-20, height: 40, marginHorizontal: 10}}
          />
        </View>
      </View>
    )
  }

  renderToggleOpened() {
    const { _t } = this.props.appActions

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 17, color: '#fff' }}>
          {_t('Open now')}
        </Text>        
        <ToggleSwitch
          isOn={this.state.filterOpened}
          onColor='green' offColor='#5ed8fc'
          label='' 
          onToggle={filterOpened => this.setState({...this.state, filterOpened})}
        />
      </View>
    )
  }

  renderActionBar() {
    const { _t } = this.props.appActions

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 120 }}>
          <Button
            bgColor='transparent' textColor='white'
            caption={_t('Cancel')}
            onPress={this.props.onClose}
          />
        </View>
        <View style={{ width: 200 }}>
          <Button
            bgColor='white' textColor={colors.primary}
            caption={`${_t('See the')} 7 ${_t('results')}`}
            onPress={this.props.onFilter}
          />
        </View>
      </View>
    )
  }
}
