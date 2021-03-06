import React, { Component } from 'react';
import {Alert} from 'react-native';
import GlobalStyles from "../../Styles"
import {TextInput, View, Text} from 'react-native';
import SectionHeader from "../../components/SectionHeader";
import ButtonCell from "../../components/ButtonCell";
import TableSection from "../../components/TableSection";
import SectionedTableCell from "../../components/SectionedTableCell";
import SectionedAccessoryTableCell from "../../components/SectionedAccessoryTableCell";
import SectionedOptionsTableCell from "../../components/SectionedOptionsTableCell";

import {moment} from "../../app"

export default class OptionsSection extends Component {

  constructor(props) {
    super(props);
    this.state = {loadingExport: false};
  }

  onExportPress = (option) => {
    let encrypted = option.key == "encrypted";
    if(encrypted && !this.props.encryptionAvailable) {
      Alert.alert('Not Available', "You must be signed in, or have a local passcode set, to generate an encrypted export file.", [{text: 'OK'}])
      return;
    }
    this.setState({loadingExport: true});
    this.props.onExportPress(encrypted, () => {
      this.setState({loadingExport: false});
    })
  }

  exportOptions = () => {
    return [
      {title: "Encrypted", key: "encrypted", selected: this.props.encryptionAvailable},
      {title: "Decrypted", key: "decrypted", selected: true}
    ];
  }

  showDataBackupAlert = () => {
    Alert.alert(
      'No Backups Created',
      "Because you are using the app offline without a sync account, it is your responsibility to keep your data safe and backed up. It is recommended you export a backup of your data at least once a week, or, to sign up for a sync account so that your data is backed up automatically.",
      [{text: 'OK'}]
    )
  }

  render() {
    var lastExportString, stale;
    if(this.props.lastExportDate) {
      var formattedDate = moment(this.props.lastExportDate).format('lll');
      lastExportString = `Last exported on ${formattedDate}`;

      // Date is stale if more than 7 days ago
      let staleThreshold = 7 * 86400;
      stale = ((new Date() - this.props.lastExportDate) / 1000) > staleThreshold;
    } else {
      lastExportString = "Your data has not yet been backed up.";
    }

    var hasLastExportSection = !this.props.signedIn;

    return (
      <TableSection>

        <SectionHeader title={this.props.title} />

        {this.props.signedIn &&
          <ButtonCell first={true} leftAligned={true} title={`Sign out (${this.props.email})`} onPress={this.props.onSignOutPress} />
        }

        <SectionedOptionsTableCell
          last={!hasLastExportSection}
          first={!this.props.signedIn}
          disabled={this.state.loadingExport}
          leftAligned={true}
          options={this.exportOptions()}
          title={this.state.loadingExport ? "Preparing Data..." : "Export Data"}
          onPress={this.onExportPress}
        />

        {hasLastExportSection &&
          <SectionedAccessoryTableCell
            last={true}
            onPress={() => {(!this.props.lastExportDate || stale) && this.showDataBackupAlert()}}
            tinted={!this.props.lastExportDate || stale}
            text={lastExportString}
          />
        }


      </TableSection>
    );
  }
}
