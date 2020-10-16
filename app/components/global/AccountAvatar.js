// @flow
import React, { Component } from 'react';

const { shell } = require('electron');

export default class AccountAvatar extends Component {

  handleLink = () => {
    const { name } = this.props;
    shell.openExternal(`https://hive.blog/@${name}`);
  }

  render() {
    const { name } = this.props;
    return (
      <a
        onClick={this.handleLink}
        style={{
          backgroundImage: `url(https://images.hive.blog/u/${name || 'hiveio'}/avatar)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'inline-block',
          height: '96px',
          width: '96px',
        }}
      />
    );
  }
}
