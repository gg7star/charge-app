import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import RecommendView from './RecommendView'
import * as AppActions from '~/root/app/store/actions'
import * as SignupActions from '../../store/actions'

const mapStateToProps = state => ({
  app: state.app || {},
  signup: state.signup || {},  
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  signupActions: bindActionCreators(SignupActions, dispatch),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RecommendView)