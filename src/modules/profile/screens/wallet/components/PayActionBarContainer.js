import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, ProfileActions } from '~/actions';
import PayActionBar from './PayActionBar';

const mapStateToProps = state => ({
  app: state.app || {},
  profile: state.profile || {},
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  profileActions: bindActionCreators(ProfileActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PayActionBar);
