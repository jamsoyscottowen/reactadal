import React, { Component } from 'react';
import logo from './logo.svg';
import { AuthenticationContext } from 'react-adal';
import './App.css';

export const adalConfig = {
  aadTenant: 'asabri.co.id',
  spaClientId: '1e957e0a-8aa7-4f77-91d7-27d25be9909b', //AAD app client id for this app
  serviceClientId: '1fd046c7-83dd-4c06-bbff-546ff92232b0', //AAD app client id for the service API app
  serviceUrl: 'http://api-hrms.asabri.co.id/api/pegawai/324', // the service API endpointa
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authContext: new AuthenticationContext({
        instance: 'https://login.microsoftonline.com/',
        tenant: adalConfig.aadTenant,
        clientId: adalConfig.serviceClientId,
        postLogoutRedirectUri: window.location.origin,
        cacheLocation: 'localStorage',
      }),
    }
    this.state.authContext.handleWindowCallback();
  }

  componentDidMount() {

    const user = this.state.authContext.getCachedUser();
    if (!user) {
      this.state.authContext.login();
    } else {
      this.getPegawaiService();
    }
  }

  getPegawaiService() {
    let serviceToken = null;
    this.state.authContext.acquireToken(adalConfig.serviceClientId, (err, res) => {
      serviceToken = res;
      console.log(serviceToken);
    });

    const r = new XMLHttpRequest();
    r.open('GET', adalConfig.serviceUrl, true);
    r.setRequestHeader('Authorization', 'Bearer ' + serviceToken);
    r.onreadystatechange = function () {
      if (r.status === 200 && r.readyState === 4)
        console.log(r.response);
    };
    r.send();
  }



  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}


export default App;
