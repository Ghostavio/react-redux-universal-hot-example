import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ListItem extends Component {
  static propTypes = {
    params: PropTypes.object
  }

  render() {
    const { params } = this.props;
    return (
      <div>
        <Link to={`/en/${params.newproject}/`}>english</Link><br/>
        <Link to={`/ar/${params.newproject}/`}>arabic</Link><br/>
        current language is {params.lang}<br/>
      </div>
    );
  }
}
