import React, { Component } from 'react';
import { Router, Stack, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import LoginStack from '~/modules/auth-login/loginRoutes';
import SignupStack from '~/modules/auth-signup/signupRoutes';
import MapStack from '~/modules/map/mapRoutes';
import ProfileStack from '~/modules/profile/profileRoutes'

class NonoRoutes extends Component {
	UNSAFE_componentDidMount() {
		if (this.props.isAuthenticated) {
			Actions['authorized']();
		}
	}

	UNSAFE_componentWillMount() {
	}

	render() {
		return (
			<Router>
				<Stack key='root' hideNavBar>
					{SignupStack}
					{LoginStack}
					<Stack key={'authorized'} hideNavBar>
						{MapStack}
						{ProfileStack}
					</Stack>
				</Stack>
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
