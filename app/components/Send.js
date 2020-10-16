// @flow
import React, { Component } from 'react';
import { Button, Checkbox, Grid, Label, Message, Modal, Radio, Segment, Select, Table } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react';
import hive from 'hivejs';

hive.config.set('rebranded_api', true)
hive.broadcast.updateOperations()

const { shell } = require('electron');

var exchangeOptions = [
  {
    key: 'bittrex',
    text: 'Bittrex (@bittrex)',
    value: 'bittrex',
  },
  {
    key: 'huobi',
    text: 'Huobi (@huobi-pro)',
    value: 'huobi-pro',
  },
  {
    key: 'binance',
    text: 'Binance (@deepcrypto8)',
    value: 'deepcrypto8',
  },
  {
    key: 'ionomy',
    text: 'Ionomy (@ionomy)',
    value: 'ionomy',
  },
  {
    key: 'probit',
    text: 'Probit (@probithive)',
    value: 'probithive',
  },
  {
    key: 'mxc',
    text: 'MXC (@mxchive)',
    value: 'mxchive',
  }
];

const exchangeLinks = {
  bittrex: 'https://bittrex.com',
  'huobi-pro': 'https://huobi.com',
  deepcrypto8: 'https://binance.com',
  ionomy: 'https://ionomy.com',
  probithive: 'https://probit.com',
  mxchive: 'https://mxc.com'
};


const exchangeSupportingEncryption = ['bittrex'];

const defaultState = {
  sourceType: 'liquid',
  from: '',
  to: '',
  amount: '',
  symbol: 'HIVE',
  memo: '',
  memoEncrypted: false,
  encryptMemo: false,
  destination: 'account_liquid',
  // destination: 'exchange',
  memoMissing: false,
  modalPreview: false,
  addContactModal: false,
  newContact: '',
};

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      from: props.keys.names[0],
      network: props.hive.props.network || 'Hive'
    });
  }
  componentDidMount() {
    this.handleBlocktrades(this.state.network);
  }
  componentWillUpdate(nextProps, nextState) {
    if( this.props.hive.props.network !== nextProps.hive.props.network) {
      this.handleBlocktrades(nextProps.hive.props.network);
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_transfer_resolved) {
      nextProps.actions.transferCompleted();
      this.resetState();
    }
  }
  resetState() {
    const props = this.props;
    this.setState({
      to: '',
      amount: '',
      memo: '',
      memoEncrypted: false,
      encryptMemo: false,
      modalPreview: false,
      memoDetected: false
    });
  }
  handleSourceTypeChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      sourceType: value
    });
  }
  handleDestinationChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      to: '',
      memo: '',
      destination: value,
      encryptMemo: false,
      memoEncrypted: false
    });
  }
  handleSymbolChange = (e: SyntheticEvent, { value }: { value: any }) => {
    const detectMemo = this.detectMemo(this.state.to, value);
    const newState = {
      amount: '',
      symbol: value,
      memo: detectMemo || '',
      memoDetected: (detectMemo)
    };
    this.setState(newState);
  }

  handleMemoEncryptChange = (e: SyntheticEvent, { value }: { value: any }) => {
    if(this.state.encryptMemo === false) {
      this.setState({
        encryptMemo: true,
        memoEncrypted: false
      })
    } else {
      this.setState({
        encryptMemo: false,
        memoEncrypted: false
      })
    }
  }

  detectMemo = (to: string, symbol: string) => {
    const { preferences } = this.props;
    const preferenceKey = [to, symbol].join("_").toLowerCase();
    if (
      preferences.hasOwnProperty(preferenceKey)
      && preferences[preferenceKey].trim !== ''
    ) {
      return preferences[preferenceKey];
    }
    return false;
  }

  handleToChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace('@', '').trim();
    if(cleaned === "add-contact") {
      e.preventDefault();
      this.setState({addContactModal: true})
      return;
    }
    const newState = {
      encryptMemo: false,
      to: cleaned,
      memo: this.detectMemo(cleaned, this.state.symbol) || '',
      memoDetected: (this.detectMemo(cleaned, this.state.symbol)),
      memoEncrypted: false
    }
    // Set state
    this.setState(newState);
  }

  handleMemoChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace(/\s+/gim, ' ');
    this.setState({
      memo: cleaned,
      encryptMemo: false,
      memoEncrypted: false
    });
  }

  handleAmountChange = (e: SyntheticEvent, { value }: { value: any }) => {
    const cleaned = value.replace(/[a-z\s]+/gim, '');
    this.setState({ amount: cleaned });
  }

  setAmountMaximum = (e: SyntheticEvent) => {
    const accounts = this.props.account.accounts;
    const { from, symbol } = this.state;
    let field = (symbol === 'HBD') ? 'hbd_balance' : 'balance';
    if(this.state.sourceType === "savings"){ field = `savings_${field}` }
    const amount = accounts[from][field].split(' ')[0];
    this.setState({ amount });
  }

  handleExternalLink = (e: SyntheticEvent) => {
    shell.openExternal(exchangeLinks[this.state.to]);
  }

  handleFromChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      from: value,
      encryptMemo: false,
      memoEncrypted: false
    })
  }

  handleContactChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace(/(@|\s)+/gim, ' ');
    this.setState({
      newContact: cleaned
    });
  }

  isFormValid = () => {
    const cleaned = this.state.memo.trim();
    if (this.state.destination === "exchange" && cleaned.length === 0) {
      this.setState({memoMissing: true});
      return false;
    } else {
      this.setState({memoMissing: false});
      return true;
    }
  }

  handlePreview = (e: SyntheticEvent) => {
    if(this.isFormValid()) {
      const cleaned = this.state.memo.trim();
      if(this.state.encryptMemo) {
        const from = this.state.from;
        const to = this.state.to;
        const memoKey = this.props.keys.permissions[from].memo
        // Make sure we have a memoKey set and it's a valid WIF
        if(memoKey && hive.auth.isWif(memoKey)) {
          // Ensure it's the current memo key on file to prevent a user from using an invalid key
          const derivedKey = hive.auth.wifToPublic(memoKey);
          const memoPublic = this.props.account.accounts[from].memo_key;
          if (derivedKey === memoPublic) {
            // Load the account we're sending to
            hive.api.getAccounts([to], (err, result) => {
              if(result.length > 0) {
                const toAccount = result[0];
                const toMemoPublic = toAccount.memo_key;
                // Generate encrypted memo based on their public memo key + our private memo key
                const memoEncrypted = hive.memo.encode(memoKey, toMemoPublic, `#${cleaned}`);
                // Set the state to reflect
                this.setState({
                  memo: cleaned,
                  memoEncrypted: memoEncrypted,
                  modalPreview: true
                });
              } else {
                // no account found
              }
            });
          } else {
            // memo key saved on account doesn't match blockchain
          }
        } else {
          // memo key is not saved or is not valid wif
        }
      } else {
        this.setState({
          memo: cleaned,
          modalPreview: true
        });
      }
    } else {
      console.log("form not valid")
    }
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  handleConfirm = (e: SyntheticEvent) => {
    var { from, to, symbol, memo, memoEncrypted } = this.state;
    const usedMemo = memoEncrypted || memo;
    const amount = parseFloat(this.state.amount).toFixed(3);
    const amountFormat = [amount, symbol].join(' ');
    if(this.state.sourceType === "liquid"){
      this.props.actions.useKey(this.state.destination.search('savings') === -1 ? 'transfer' : 'transferToSavings', { from, to, amount: amountFormat, memo: usedMemo }, this.props.keys.permissions[from]);
    } else {
      let requestId = 0;
      hive.api.getSavingsWithdrawFrom(from, (err, result) => {
        if(result.length !== 0) { requestId = result[result.length-1].request_id+1; }
        this.props.actions.useKey('transferFromSavings', { from, requestId, to, amount: amountFormat, memo: usedMemo }, this.props.keys.permissions[from]);
      })
    }
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
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

  handleBlocktrades = (network) => {
    network = network ? network.toLowerCase() : 'hive';
    var key = {
      hive: 'blocktrades'
    }
    var found = exchangeOptions.find((x) => { return x.key === key[network]; })
    if ( !found ) {
      exchangeOptions.unshift({
        key: key[network],
        text: `Blocktrades (@${key[network]})`,
        value: key[network],
      })
    }

    exchangeLinks[key[network]] = 'https://blocktrades.us';

    if (network === "hive") {
      found = exchangeOptions.find((x) => { return x.key === key['steem']; })
      exchangeOptions = exchangeOptions.filter((x) => { return x !== found });
      delete exchangeLinks[key['steem']]
    } else {
      found = exchangeOptions.find((x) => { return x.key === key['hive']; })
      exchangeOptions = exchangeOptions.filter((x) => { return x !== found });
      delete exchangeLinks['blocktrades']
    }

    this.forceUpdate();
  }

  render() {    
    const accounts = this.props.account.accounts;
    const keys = this.props.keys;
    const availableFrom = keys.names.map((name) => {
      const hasPermission = (keys.permissions[name].type === 'active' || keys.permissions[name].type === 'owner');
      return hasPermission ? {
        key: name,
        text: name,
        value: name
      } : {
        key: name,
        disabled: true,
        text: name + ' (unavailable - active/owner key not loaded)'
      };
    });
    let field = (this.state.symbol === 'HBD') ? 'hbd_balance' : 'balance';
    if(this.state.sourceType === 'savings'){ field = `savings_${field}` };
    const availableAmount = accounts[this.state.from][field];
    const errorLabel = <Label color="red" pointing/>;
    let modal = false;
    let toField = (
      <Form.Field
        control={Input}
        name="to"
        label="Enter the account name"
        placeholder="Enter the account name to send to..."
        value={this.state.to}
        onChange={this.handleToChange}
        // validationErrors={{
          // accountName: 'Invalid account name'
        // }}
        errorLabel={errorLabel}
      />
    );
    let encryptedField = false;
    if (this.state.destination === 'exchange') {
      let externalLink = false;
      if (this.state.to) {
        externalLink = (
          <p style={{ marginLeft: '1em' }}>
            {exchangeNotes[this.state.to]}
            <a
              onClick={this.handleExternalLink}
              value={this.state.to}
            >
              {' '}
              {exchangeLinks[this.state.to]}
            </a>
          </p>
        );
      }
      toField = (
        <div>
          <Form.Field
            control={Select}
            search
            value={this.state.to}
            label="Select an exchange:"
            options={exchangeOptions}
            onChange={this.handleToChange}
            placeholder="Receiving exchange..."
          />
          {externalLink}
        </div>
      );
    }
    if (this.state.destination === 'contact') {
      let contactList = this.props.account.contacts ? this.props.account.contacts.slice() : [];
      contactList = contactList.map((contact) => {
        return {
          key: contact,
          text: `@${contact}`,
          value: contact,
        }
      })
      contactList.push({
        key: 'add-contact',
        text: 'Add a New Contact',
        value: 'add-contact'
      })
      toField = (
        <div>
          <Form.Field
            control={Select}
            search
            value={this.state.to}
            label="Select a contact:"
            options={contactList}
            onChange={this.handleToChange}
            placeholder="Saved contact..."
          />
        </div>
      );
    }
    if (keys.permissions[this.state.from] && keys.permissions[this.state.from].memo && hive.auth.isWif(keys.permissions[this.state.from].memo)) {
      if ((exchangeSupportingEncryption.indexOf(this.state.to) >= 0) || (this.state.destination === 'account')) {
        encryptedField = (
          <Form.Field>
            <Checkbox
              label='Encrypt Memo?'
              checked={this.state.encryptMemo}
              onChange={this.handleMemoEncryptChange}
            />
          </Form.Field>
        );
      }
    }
    if (this.state.modalPreview) {
      modal = (
        <Modal
          open
          header="Please confirm the details of this transaction"
          autoFocus={true}
          content={
            <Segment basic padded>
              <p>
                Ensure that all of the data below looks correct before continuing.
                If you mistakenly send to the wrong accout (or with the wrong memo)
                you may lose funds.
              </p>
              <Table
                definition
                collapsing
                style={{ minWidth: '300px', margin: '0 auto' }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="right">Field</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Source:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.sourceType}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Destination:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.destination.replace('account_','')}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      From:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.from}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      To:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.to}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Amount:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.amount}
                      {' '}
                      {this.state.symbol}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Memo:
                    </Table.Cell>
                    <Table.Cell>
                      <code>{(this.state.memoEncrypted) ? this.state.memoEncrypted : this.state.memo}</code>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: 'cancel',
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancel,
              disabled: this.props.processing.account_transfer_pending
            },
            {
              key: 'yes',
              icon: 'checkmark',
              content: 'Confirmed - this is correct',
              color: 'green',
              onClick: this.handleConfirm,
              disabled: this.props.processing.account_transfer_pending
            }
          ]}
        />
      );
    }
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
      <Form
        error={!!this.props.processing.account_transfer_error}
        loading={this.props.processing.account_transfer_pending}
      >
        {modal}
        <Grid divided centered>
          <Grid.Row>
            <Message
              warning
              visible={this.state.sourceType === "savings" || this.state.destination === "account_savings"}
              header="Savings Account Warning"
              content="Transferring from savings account takes 3.5 days and can be cancelled anytime before completion."
            />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="from">Send from...</label>
              </div>
              <Form.Field
                control={Radio}
                name="sourceType"
                label="liquid"
                value="liquid"
                checked={this.state.sourceType === 'liquid'}
                onChange={this.handleSourceTypeChange}
              />
              <Form.Field
                control={Radio}
                name="sourceType"
                label="savings"
                value="savings"
                checked={this.state.sourceType === 'savings'}
                onChange={this.handleSourceTypeChange}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <Form.Field
                control={Select}
                value={this.state.from}
                name="from"
                label="Select a loaded account"
                options={availableFrom}
                placeholder="Sending Account..."
                onChange={this.handleFromChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="destination">Send to a...</label>
              </div>
              <Form.Field
                control={Radio}
                name="destination"
                label="another user (liquid)"
                value="account_liquid"
                checked={this.state.destination === 'account_liquid'}
                onChange={this.handleDestinationChange}
              />
              <Form.Field
                control={Radio}
                name="destination"
                label="an exchange"
                value="exchange"
                checked={this.state.destination === 'exchange'}
                onChange={this.handleDestinationChange}
              />
              <Form.Field
                control={Radio}
                name="destination"
                label="saved contact"
                value="contact"
                checked={this.state.destination === 'contact'}
                onChange={this.handleDestinationChange}
              />
              <Form.Field
                control={Radio}
                name="destination"
                label="another user (savings)"
                value="account_savings"
                checked={this.state.destination === 'account_savings'}
                onChange={this.handleDestinationChange}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              {toField}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className="field">
                <label htmlFor="symbol">Select Currency Type</label>
              </div>
              <Form.Field
                control={Radio}
                name="symbol"
                label="HIVE"
                value="HIVE"
                checked={this.state.symbol === 'HIVE'}
                onChange={this.handleSymbolChange}
              />
              <Form.Field
                control={Radio}
                name="symbol"
                label="HBD"
                value="HBD"
                checked={this.state.symbol === 'HBD'}
                onChange={this.handleSymbolChange}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <div className="field">
                <label htmlFor="amount">Total {this.state.symbol} to Send</label>
              </div>
              <Form.Field
                control={Input}
                name="amount"
                placeholder="Enter the amount to transfer..."
                value={this.state.amount}
                onChange={this.handleAmountChange}
                validationErrors={{
                  isNumeric: 'The amount must be a number'
                }}
                errorLabel={errorLabel}
              />
              <p>
                <a
                  onClick={this.setAmountMaximum}
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}
                >
                  {availableAmount}
                </a>
                {' '}
                available to send.
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Field
                control={Input}
                name="memo"
                label={this.state.memoDetected ? 'Memo automatically set via preferences.' : 'Optional memo to include'}
                placeholder="Enter a memo to include with the transaction"
                value={this.state.memo}
                onChange={this.handleMemoChange}
              />
              {encryptedField}
              <Message
                error
                visible={this.state.memoMissing}
                header="Form Validation Error"
                content="A memo is required when sending to an exchange otherwise you may lose your tokens."
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Message
                error
                header="Operation Error"
                content={this.props.processing.account_transfer_error}
              />
              <Form.Field
                control={Button}
                color="purple"
                content="Preview Transaction"
                onClick={this.handlePreview}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
