import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppActions, ProfileActions } from '~/actions';
import View from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
  auth: state.auth || {}
})

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch)
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)
(View)
