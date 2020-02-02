import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, SignupActions } from '~/actions';
import ConfirmCodeView from './ConfirmCodeView';

const mapStateToProps = state => ({
  app: state.app || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ConfirmCodeView);