// @flow
import React, { Component } from 'react';
import hive from '@hiveio/hive-js';
import { Button, Checkbox, Divider, Form, Grid, Header, Message, Segment, Table, Radio } from 'semantic-ui-react';

export default class KeysAuth extends Component {
  constructor(props) {
    super(props);
    this.state.public = this.props.keys.confirmMemo.public;
    this.state.action = "add"; // "remove"
    this.state.errors = this.validate(this.state);
  }
  state = {
    action: 'add',
    wif: '',
    errors: {
      wif_error_invalid: false,
      wif_not_valid: false,
    }
  }

  handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
    const newState = Object.assign({}, this.state, {
      [name]: value
    });
    console.log({name,value})
    newState.errors = this.validate(newState);
    this.setState(newState);
  }

  validate = (newState) => {
    const errors = {};
    errors.wif_error_invalid = !hive.auth.isWif(newState.wif);
    errors.wif_not_valid = true;
    if (newState.wif && hive.auth.wifIsValid(newState.wif, newState.public) === true) {
      errors.wif_not_valid = false;
    }
    return errors;
  }

  hasErrors = () => {
    const errors = this.state.errors;
    return !!Object.keys(errors).filter((error) => errors[error]).length;
  }

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { addMemoKey } = this.props.actions;
    const { action, wif } = this.state;
    // addMemoKey(action, wif);
  }

  render() {
    const { action, wif } = this.state;
    const errors = this.state.errors;
    const hasErrors = this.hasErrors();
    const messages = {
      wif_error_invalid: 'They WIF Private Key you have is not valid.',
      wif_not_valid: 'The WIF Private Key does not match the memo key of this account.'
    };
    let handleMethodReset = false;
    if (this.props.handleMethodReset) {
      handleMethodReset = (
        <Segment basic textAlign="center">
          <Button
            size="large"
            color="red"
            content="Cancel"
            onClick={this.props.handleMethodReset}
          />
        </Segment>
      );
    }
    let message = false;
    let warning = false;
    if (hasErrors) {
      if (errors.wif_not_valid) {
        message = messages.wif_not_valid;
      }
      if (errors.wif_error_invalid) {
        message = messages.wif_error_invalid;
      }
      warning = (
        <Message
          error
          icon="warning"
          content={message}
        />
      );
    }
    let display = (
      <Segment padded>
        <Message
          error
          icon="warning"
          content="This feature is intended for advanced users only, please make sure you know what you're doing when changing your account auths. Mistakes can make your account inaccessible."
        />
        <Header>
          <Header.Subheader>
            If you'd like to add or remove an account or key auth, continue with the form below:
          </Header.Subheader>
        </Header>
        <Divider hidden />
        <Form
          error={hasErrors}
        >
          <Grid divided>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Field>
                  <Radio
                    label='Add'
                    name='action'
                    value='add'
                    checked={this.state.action === 'add'}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Remove'
                    name='action'
                    value='remove'
                    checked={this.state.action === 'remove'}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Key'
                    name='type'
                    value='key'
                    checked={this.state.type === 'key'}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Account'
                    name='type'
                    value='account'
                    checked={this.state.type === 'account'}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {warning}
          <Divider />
          <Button disabled={hasErrors} fluid size="large" color="green" onClick={this.handleSubmit}>
            Add Memo Key
          </Button>
          {handleMethodReset}
        </Form>
      </Segment>
    );
    return display;
  }
}
