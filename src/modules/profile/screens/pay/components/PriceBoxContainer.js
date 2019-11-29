import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import PriceBox from './PriceBox'
import * as AppActions from '~/root/app/store/actions'
import * as ProfileActions from '~/modules/profile/store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PriceBox)