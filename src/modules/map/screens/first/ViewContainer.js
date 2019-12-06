import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, MapActions, StripeActions } from '~/actions';
import View from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  map: state.map || {},
  auth: state.auth || {},
  stripe: state.stripe || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  stripeActions: bindActionCreators(StripeActions, dispatch)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(View);