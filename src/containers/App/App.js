import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { Footer, Header } from 'components';
import { pushState } from 'redux-router';
import config from '../../config';

@connect(
  state => ({
    user: state.auth.user
  }),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    params: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  static fetchData(getState, dispatch) {
    const promises = [];
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }

  /*handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  handleLanguage(event) {
    event.preventDefault();
    this.props.changeLocale('ar');
  }*/

  render() {
    const { params } = this.props;
    const styles = require('./App.scss');
    return (
      <div>
        <DocumentMeta {...config.app.meta} />

        <Header params={params}/>

        <main role="main" className={styles.content}>
          {this.props.children}
        </main>

        <Footer />
      </div>
    );
  }
}
