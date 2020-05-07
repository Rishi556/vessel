// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as AccountActions from '../actions/account';
import * as HiveActions from '../actions/hive';
import * as PreferencesActions from '../actions/preferences';

const srcHive = require('../img/hive.png');
const srcSteem = require('../img/steem.png');

class MenuBar extends Component {

  state = {
    intervalId: 0
  };

  componentDidMount() {
    this.interval = setInterval(this.timer.bind(this), 10000);
    this.timer();
    // this.props.actions.getTransactions(this.props.keys.names);
  }

  componentWillUnmount() {
    // console.log('unmounting');
    clearInterval(this.interval);
  }

  interval = 0;

  timer = () => {
    // console.log('tick');
    this.props.actions.refreshAccountData(this.props.keys.names);
    this.props.actions.refreshGlobalProps();
    // this.props.actions.getTransactions(this.props.account.names);
  }

  render() {
    let height = 'Loading', network = 'Loading';
    if (this.props.hive.props) {
      height = this.props.hive.props.head_block_number;
      network = this.props.hive.props.network;
    }
    return (
      <Menu vertical fixed="left" color="black" inverted icon="labeled">
        <Menu.Item header>
          <a onClick={() => {
            var newNode = this.props.hive.props.network === "Hive" ? "https://api.steemit.com" : "https://anyx.io";
            this.props.actions.setPreference('hived_node', newNode)
            setTimeout(() => {
              this.props.actions.refreshAccountData(this.props.keys.names);
              this.props.actions.refreshGlobalProps();
            }, 250);
          }}>
            <img
              alt="Vessel"
              className="ui tiny image"
              src={network === "Hive" ? srcHive : srcSteem}
              style={{
                width: '50px',
                height: '50px',
                margin: '0 auto 1em',
              }}
            />
          </a>
          Vessel
        </Menu.Item>
        <Link className="link item" to="/transactions">
          <Icon name="dashboard" />
          Overview
        </Link>
        <Link className="link item" to="/send">
          <Icon name="send" />
          Send
        </Link>
        <Link className="link item" to="/vesting">
          <Icon name="lightning" />
          Vesting
        </Link>
        <Link className="link item" to="/accounts">
          <Icon name="users" />
          Accounts
        </Link>
        <Link className="link item" to="/settings">
          <Icon name="settings" />
          Settings
        </Link>
        <Link className="link item" to="/advanced">
          <Icon name="lab" />
          Advanced
        </Link>
        <Menu.Item
          className="link"
          style={{
            position: 'absolute',
            bottom: 0
          }}
        >
        <div>
          <span style={{lineHeight: '1.5em'}}>Chain:</span><br/>
          <span
            style={{fontWeight: 700}}
            className="hivered">{network}</span>
          <hr />
          <span style={{lineHeight: '1.5em'}}>Height:</span><br/>
          <span
            style={{fontWeight: 700}}
            className="hivered">{height}</span>
        </div>
        </Menu.Item>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
    hive: state.hive,
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...HiveActions,
      ...PreferencesActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
