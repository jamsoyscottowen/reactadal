import React, { Component } from 'react';
import logo from './logo.svg';
import { AuthenticationContext } from 'react-adal';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      aadTenant: 'asabri.co.id',
      spaClientId: '1e957e0a-8aa7-4f77-91d7-27d25be9909b', //AAD app client id for this app
      serviceClientId: '1fd046c7-83dd-4c06-bbff-546ff92232b0', //AAD app client id for the service API app
      serviceUrl: 'http://api-hrms.asabri.co.id/api/pegawai', // the service API endpointa
    }
  }

  componentDidMount() {
    const authContext = new AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      tenant: this.state.aadTenant,
      clientId: this.state.serviceClientId,
      postLogoutRedirectUri: window.location.origin,
      cacheLocation: 'localStorage',
    });

    const isCallback = authContext.isCallback(window.location.hash)

    if (isCallback) {
      authContext.handleWindowCallback();
    } else {
      authContext.login();
    }

    let serviceToken = null;
    authContext.acquireToken(this.state.serviceClientId, (err, res) => {
      serviceToken = res;
      console.log(serviceToken);
    });

    const r = new XMLHttpRequest();
    r.open('GET', this.state.serviceUrl, true);
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
