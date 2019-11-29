import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import PlacesList from './PlacesList'
import * as AppActions from '~/root/app/store/actions'
import * as MapActions from '~/modules/map/store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  map: state.map || {},  
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PlacesList)
