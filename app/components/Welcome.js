// @flow
import React, { Component } from "react";
import { Redirect } from "react-router";
import { Button, Divider, Grid, Header, Segment } from "semantic-ui-react";

import KeysAdd from "./Keys/Add";
import KeysGenerate from "./Keys/Generate";
import KeysImport from "./Keys/Import";
import KeysLogin from "./Keys/Login";
import PreferredNode from "./global/PreferredNode";

const logo = require("../img/hive.png");
const { shell } = require("electron");

export default class Welcome extends Component {
  state = {
    importMethod: false
  };

  render() {
    return (
      <Grid divided stretched>
        <Grid.Row centered>
          <Grid.Column width={5} stretched>
            <Segment basic textAlign="center"
              style={{ display: 'flex', alignitems: 'center', justifyContent: 'center', flexFlow: 'column', maxHeight: '100vh' }}
            >
              <img
                alt="logo"
                className="ui tiny image"
                src={logo}
                style={{
                  margin: "-1em auto 1em"
                }}
              />
              <Header size="large" style={{ marginTop: '0px' }}>
                Vessel
                <Header.Subheader>
                  <p>Your Desktop Wallet for Hive</p>
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
          <Grid.Column width={11}>
            <Segment basic padded>
              <Segment padded>
                <Header>
                  Getting Started
                  <Header.Subheader>
                    To get started with Vessel, an account must be added to the
                    wallet.
                  </Header.Subheader>
                </Header>

                <KeysAdd {...this.props} />
                <PreferredNode {...this.props} />
              </Segment>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
