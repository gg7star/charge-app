import React, { Component } from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { SignUp } from '~/modules/auth-signup';
import Login from '~/modules/auth-login/screens/login/ViewContainer';
import MapStack from '~/modules/map/mapRoutes';
import ProfileStack from '~/modules/profile/profileRoutes';
import HintStack from '~/modules/hints/hintRoutes';
import SetUserInfoStack from '~/modules/user-info/userinfoRoutes';

class NonoRoutes extends Component {
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
						component={SignUp}
					/>
					{SetUserInfoStack}
					{HintStack}
					<Scene key='home' hideNavBar>
						{MapStack}
						{ProfileStack}
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
