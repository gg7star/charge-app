import React, { Component } from 'react';
import { Router, Stack, Scene, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  FirstScreen,
  SetConfirmCode,
  SetName,
  SetEmail,
  SetBirthday,
  HintFindStation,
  HintScanQr,
  HintSaved,
  HintBringback,
  HintRecommend
} from '~/modules/auth-signup';
import Login from '~/modules/auth-login/screens/login/ViewContainer';
import MapStack from '../modules/map/mapRoutes';
import ProfileStack from '../modules/profile/profileRoutes';

class NonoRoutes extends Component {
	// UNSAFE_componentDidMount() {
	// 	console.log('==== UNSAFE_componentDidMount')
	// 	if (this.props.isAuthenticated) {
	// 		console.log('==== go to map')
	// 		// Actions['authorized']();
	// 		Actions.map();
	// 		Actions['map_first']();
	// 	}
	// }

	render() {
		return (
			<Router>
				<Scene key='root' hideNavBar panHandlers={null}>
					<Scene 
						key='login'
						hideNavBar
						component={Login}
					/>
					<Scene 
						key='signup_first'
						hideNavBar
						component={FirstScreen}
					/>
					<Scene 
						key='signup_set_confirm_code'
						hideNavBar
						component={SetConfirmCode}
					/>
					
					<Scene key='home' hideNavBar>
						{MapStack}
						{ProfileStack}
					</Scene>

					<Scene key='set_user_info' hideNavBar>
						<Scene 
							key='signup_set_name'
							hideNavBar
							component={SetName}
						/>
						<Scene 
							key='signup_set_email'
							hideNavBar
							component={SetEmail}
						/>
						<Scene 
							key='signup_set_birthday'
							hideNavBar
							component={SetBirthday}
						/>
					</Scene>
					
					<Scene key='hint' hideNavBar>
						<Scene 
							key='signup_hint_find_station'
							hideNavBar
							component={HintFindStation}
						/>
						<Scene 
							key='signup_hint_scan_qr'
							hideNavBar
							component={HintScanQr}
						/>
						<Scene 
							key='signup_hint_saved'
							hideNavBar
							component={HintSaved}
						/>
						<Scene 
							key='signup_hint_bringback'
							hideNavBar
							component={HintBringback}
						/>
						<Scene 
							key='signup_hint_recommend'
							hideNavBar
							component={HintRecommend}
						/>
					</Scene>
				</Scene>
			</Router>
		)
	}
}

const mapStateToProps = function(state) {
	const { auth } = state
	return {
		isAuthenticated: auth && auth.isAuthenticated
	}
}

export default connect(mapStateToProps)(NonoRoutes)
