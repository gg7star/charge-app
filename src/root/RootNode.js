import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppViewContainer from './app/view/ViewContainer';

export default class Nono extends Component {
  
  render() {
    return (
      <Provider store={store()}>
				<AppViewContainer />
      </Provider>
    );
  }
}
