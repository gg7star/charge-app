import React from 'react'
import Dialog2Wrapper from '../../common/wrappers/Dialog2Wrapper'
import { View } from 'react-native'
import { Button } from '~/common/components'
import { colors, W, H } from '~/common/constants'
import SearchFormContainer from './components/SearchFormContainer'
import SearchResults from './components/SearchResultsContainer'

export default class Dialog extends React.Component {
  render() {
    const { _t } = this.props.appActions

    return (
      <React.Fragment>
        <View style={{
          position: 'absolute', zIndex: 35,
          left: 0, top: 0, width: W, height: H,
          backgroundColor: 'rgba(0, 0, 0, 0.44)'
        }}>
        </View>
        <Dialog2Wrapper>
          <SearchFormContainer onCancel={this.props.onCancel} />
          <SearchResults selectPlace={this.props.selectPlace}/>
        </Dialog2Wrapper>
      </React.Fragment>
    )
  }
}
