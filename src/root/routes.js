import React, { Component } from 'react';
import { Router, Scene, Stack, Actions, Drawer } from 'react-native-router-flux';
import { connect } from 'react-redux';

import AuthStack from '~/modules/auth/routes'
import SignupStack from '~/modules/auth_signup/routes'
import MapStack from '~/modules/map/routes'
import ProfileStack from '~/modules/profile/routes'

class NonoRoutes extends Component {
	componentDidMount() {
		if (this.props.isAuthenticated) {
			Actions['authorized']();
		}
	}

	componentWillMount() {
	}

	render() {
		return (
			<Router>
				<Stack key='root' hideNavBar>
					{SignupStack}
					{AuthStack}
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
