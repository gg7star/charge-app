import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { AppActions, MapActions, StripeActions, RentActions } from '~/actions';
import View from './View';

const mapStateToProps = state => ({
  app: state.app || {},
  map: state.map || {},
  auth: state.auth || {},
  stripePayment: state.stripePayment || {},
  rent: state.rent || {}
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(AppActions, dispatch),
  mapActions: bindActionCreators(MapActions, dispatch),
  stripeActions: bindActionCreators(StripeActions, dispatch),
  rentActions: bindActionCreators(RentActions, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(View);