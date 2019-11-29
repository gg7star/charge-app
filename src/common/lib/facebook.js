import React from 'react'
import { LoginButton, LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

class FacebookService {
  constructor() {
    this.requestManager = new GraphRequestManager()
  }

  makeLoginButton = (callback) => {
    return (
      <LoginButton
        readPermissions={["public_profile"]}
        onLoginFinished={(error, result) => {
          if (error) {

          } else if (result.isCancelled) {

          } else {
            AccessToken.getCurrentAccessToken()
              .then((data) => {
                callback(data.accessToken)
              })
              .catch(error => {
                console.log(error)
              })
          }
        }} />
    )
  };

  makeLogoutButton = (callback) => {
    return (
      <LoginButton onLogoutFinished={() => {
        callback()
      }} />
    )
  };

  loginWithLoginManager = (callback) => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
          callback({action: 'cancel', data: null});
        } else {
          console.log('Login success with result: ', result);
          callback({action: 'loggedin', data: result});
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
        callback({action: 'failed', data: error});
      }
    )
  };

  async fetchProfile(callback) {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me',
        {
          httpMethod: 'GET',
          version: 'v2.5',
          parameters: {
            'fields': {
              'string' : 'name,email,friends,birthday'
            }
          }
        },
        (error, result) => {
          if (result) {
            const profile = result;
            profile.avatar = `https://graph.facebook.com/${result.id}/picture`;
            console.log('===== profile: ', profile);
            resolve(profile);
          } else {
            reject(error);
          }
        }
      );
      this.requestManager.addRequest(request).start();
    });
  }
}

export const facebookService = new FacebookService()