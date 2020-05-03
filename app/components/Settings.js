// @flow
import React, { Component } from 'react';

import PreferredNode from './global/PreferredNode'
import { Form, Input } from 'formsy-semantic-ui-react'
import { Divider, Grid, Header, Label, Segment, Select, Table, Button, Modal } from 'semantic-ui-react';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addContactModal: false,
      newContact: '',
    }
  }

   handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
     const { setPreference } = this.props.actions;
     setPreference(name, value);
  }

  onValidSubmit = (
   e: SyntheticEvent
 ) => {
    const { setPreference } = this.props.actions;
    setPreference('hived_node', e.hived_node);
 }

  handleContactChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace(/(@|\s)+/gim, ' ');
    this.setState({
      newContact: cleaned
    });
  }

  handleCancelContact = (e: SyntheticEvent) => {
    this.setState({
      addContactModal: false
    });
    e.preventDefault();
  }

  handleConfirmContact = (e: SyntheticEvent) => {
    const { newContact } = this.state;
    if (newContact !== '') this.props.actions.addContact(newContact);
    this.setState({
      addContactModal: false,
      newContact: ''
    });
    e.preventDefault();
  }

  render() {
    let modal = false;
    let contactList = this.props.account.contacts && this.props.account.contacts.map((contact) => {
      return (        
        <Table.Row key={contact} textAlign="center">
          <Table.Cell>
            {contact}
          </Table.Cell>
          <Table.Cell width={5}>
            <Button
              onClick={() => this.props.actions.removeContact(contact)}
              secondary
              >
              Remove
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    })

    if (this.state.addContactModal) {
      modal = (
        <Modal
          open
          header="Add a New Contact"
          content={
            <Segment basic padded>
              <Form>
                <Form.Field
                  control={Input}
                  name="contact"
                  label='Username to add to contact list'
                  placeholder="username (without @)"
                  autoFocus={true}
                  value={this.state.newContact}
                  onChange={this.handleContactChange}
                />
              </Form>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: 'cancel',
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancelContact,
            },
            {
              key: 'yes',
              icon: 'checkmark',
              content: 'Confirmed - add contact',
              color: 'green',
              onClick: this.handleConfirmContact,
            }
          ]}
        />
      );
    }

    return (
      <Segment basic padded>

        <PreferredNode {...this.props} />

        <Divider />

        <Form>

          <Header>
            Exchange Configuration
            <Header.Subheader>
              Configure the required <strong>unencrypted memo</strong> for each
              individual currency and exchange. Do <strong>NOT</strong> add the
              <strong>#</strong> prefix for encryption, only the memo that the exchange
              specifies.
            </Header.Subheader>
          </Header>

          <Segment attached>
            <Header size="small">
              Blocktrades
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="blocktrades_hbd"
                value={this.props.preferences.blocktrades_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for Blocktrades"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="blocktrades_hive"
                value={this.props.preferences.blocktrades_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for Blocktrades"
              />
            </Form.Group>
          </Segment>

          <Segment attached>
            <Header size="small">
              Bittrex
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="bittrex_hbd"
                value={this.props.preferences.bittrex_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for Bittrex"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="bittrex_hive"
                value={this.props.preferences.bittrex_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for Bittrex"
              />
            </Form.Group>
          </Segment>

          <Segment attached>
            <Header size="small">
              Huobi
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="huobi_hbd"
                value={this.props.preferences.huobi_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for Huobi"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="huobi_hive"
                value={this.props.preferences.huobi_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for Huobi"
              />
            </Form.Group>
          </Segment>

          <Segment attached>
            <Header size="small">
              Ionomy
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="ionomy_hbd"
                value={this.props.preferences.ionomy_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for Ionomy"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="ionomy_hive"
                value={this.props.preferences.ionomy_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for Ionomy"
              />
            </Form.Group>
          </Segment>

          <Segment attached>
            <Header size="small">
              ProBit
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="probit_hbd"
                value={this.props.preferences.probit_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for ProBit"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="probit_hive"
                value={this.props.preferences.probit_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for ProBit"
              />
            </Form.Group>
          </Segment>

          <Segment attached>
            <Header size="small">
              MXC
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="HBD Memo (Unencrypted)"
                name="mxc_hbd"
                value={this.props.preferences.mxc_hbd}
                onChange={this.handleChange}
                placeholder="Enter your HBD Unencrypted Memo key for MXC"
              />
              <Form.Input
                label="HIVE Memo (Unencrypted)"
                name="mxc_hive"
                value={this.props.preferences.mxc_hive}
                onChange={this.handleChange}
                placeholder="Enter your HIVE Unencrypted Memo key for MXC"
              />
            </Form.Group>
          </Segment>

        </Form>

        <Divider />

        <Header>
          Contact List
          <Header.Subheader>
            Add or remove users from your contact list.
          </Header.Subheader>
        </Header>

        <Segment attached>
          <Table
            definition
            collapsing
            style={{ minWidth: '300px', margin: '0 auto' }}
          >
            <Table.Body>
              {contactList}
              <Table.Row>
                <Table.Cell colSpan={2} textAlign="center">
                  <Button
                    onClick={() => this.setState({addContactModal: true})}
                    primary
                    >
                    Add New Contact
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>

      {modal}
      </Segment>
    );
  }
}
