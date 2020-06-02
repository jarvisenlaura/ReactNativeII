/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featureOn: false,
      incoming: false,
      number: null,
    };
  }
  startListenerTapped = () => {
    this.setState({featureOn: true});
    this.callDetector = new CallDetectorManager(
      (event, number) => {
        // For Android event will be either "Offhook",
        // "Disconnected", "Incoming" or "Missed"
        if (event === 'Disconnected') {
          // Do something call got disconnected
          this.setState({incoming: false, number: null});
        } else if (event === 'Incoming') {
          // Do something call got incoming
          this.setState({incoming: true, number});
        } else if (event === 'Offhook') {
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android
          this.setState({incoming: true, number});
        } else if (event === 'Missed') {
          // Do something call got missed
          // This clause will only be executed for Android
          this.setState({incoming: false, number: null});
        }
      },
      true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  };
  stopListenerTapped = () => {
    this.setState({featureOn: false});
    this.callDetector && this.callDetector.dispose();
  };
  render() {
    return (
      <View style={styles.body}>
        <Text style={styles.text}>Laitetaanko numerotutka päälle?</Text>
        <TouchableHighlight
          onPress={
            this.state.featureOn
              ? this.stopListenerTapped
              : this.startListenerTapped
          }>
          <View
            style={{
              width: 200,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.featureOn
                ? 'greenyellow'
                : 'indianred',
            }}>
            <Text style={styles.text}>
              {this.state.featureOn ? `On päällä` : `On pois päältä`}{' '}
            </Text>
          </View>
        </TouchableHighlight>
        {this.state.incoming && (
          <Text style={{fontSize: 50}}>PUHELU {this.state.number}</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: 'honeydew',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    padding: 20,
    fontSize: 20,
  },
  button: {},
});
