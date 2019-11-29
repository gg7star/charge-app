import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import View from './View'
import * as AppActions from '~/root/app/store/actions'
import * as StripeActions from '~/root/stripe/store/actions'
import * as MapActions from '../../store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  map: state.map || {},
  auth: state.auth || {},
  stripe: state.stripe || {}
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  stripeActions: bindActionCreators(StripeActions, dispatch)
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(View)