// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Divider, Grid, Header, Segment } from 'semantic-ui-react';

import KeysGenerate from './Generate';
import KeysImport from './Import';
import KeysLogin from './Login';
import KeysCreate from './Create';

export default class Welcome extends Component {

  state = {
    importMethod: false
  }
  handleMethodChange = (e, props) => this.setState({ importMethod: props.value })
  handleMethodReset = (e, props) => this.setState({ importMethod: false })

  render() {
    let display = (
      <Segment.Group>
        <Segment padded>
          <Header style={{ marginBottom: '10px' }}>
            I have a password
            <Header.Subheader>
              Choose this option if your account was created with a password.
            </Header.Subheader>
          </Header>
          <Button
            color="green"
            size="large"
            onClick={this.handleMethodChange}
            value="login-hive"
          >
            Import Account with Password
          </Button>
        </Segment>
        <Segment padded>
          <Header style={{ marginBottom: '10px' }}>
            Specific Private Key
            <Header.Subheader>
              Choose this option if you want to import only a specific key. Possible keys: Posting, Active, Owner, Memo.
            </Header.Subheader>
          </Header>
          <Button
            color="green"
            size="large"
            onClick={this.handleMethodChange}
            value="import-private-key"
          >
            Import Private Key
          </Button>
        </Segment>
        <Segment padded>
          <Header style={{ marginBottom: '10px' }}>
            Experimental: Generate New Private Keys
            <Header.Subheader>
              For advanced users.
              Create a new set of public and private keys for a new Hive
              account. These <strong>public</strong> keys can then be given
              to another user or service allowing the creation of an account.
            </Header.Subheader>
          </Header>
          <Button
            color="black"
            size="large"
            onClick={this.handleMethodChange}
            value="generate-private-key"
          >
            Generate new private keys
          </Button>
        </Segment>
      </Segment.Group>
    );
    switch (this.state.importMethod) {
      case 'import-private-key':
        display = (
          <KeysImport
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      case 'login-hive':
        display = (
          <KeysLogin
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      case 'generate-private-key':
        display = (
          <KeysGenerate
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      default: {
        break;
      }
    }
    return display;
  }
}
