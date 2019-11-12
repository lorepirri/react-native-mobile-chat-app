import React, { Component } from 'react';
import {
  StyleSheet, Platform, ImageBackground, Text, TextInput, TouchableOpacity, Button, View,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const CHAT_COLOR_1 = '#090C08';
const CHAT_COLOR_2 = '#474056';
const CHAT_COLOR_3 = '#8A95A5';
const CHAT_COLOR_4 = '#B9C6AE';

// This class implements the Start screen
export default class Start extends Component {
  constructor(props) {
    super(props);
    // set the state for the user name and color (default set to the third one)
    this.state = {
      userName: '',
      chatColor: CHAT_COLOR_3,
    };
  }

  render() {
    return (
      // wrap everything with ImageBackground to have a nice image background
      <ImageBackground source={require('../assets/background.png')} style={{flex: 1, width: '100%', height: '100%'}}>
        {/* main container 100% height */}
        <View style={styles.container}>
          {/* this view is to add an empty header */}
          <View style={styles.headerBox} />
          {/* this view contains the title of the app */}
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>Mobile Chat</Text>
          </View>
          {/* this view contains the white box to enter username
              select color and button to enter in chat */}
          <View style={styles.userBox}>
            {/* Username input box */}
            <View style={styles.innerBox}>
              <TextInput
                style={styles.userNameInputbox}
                accessible={true}
                accessibilityLabel="Input name"
                accessibilityHint="Let you choose your name for the chat."
                accessibilityRole="button"
                onChangeText={(userName) => this.setState({ userName })}
                value={this.state.userName}
                placeholder="Your Name"
              />
            </View>
            {/* Background color selection */}
            <View style={styles.innerBox}>
              <Text style={styles.chooseBackgroundText}>Choose Background Color</Text>
              {/* the list of color buttons to choose from */}
              <View style={styles.chooseBackgroundColorBox}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Choose color 1"
                  accessibilityHint="Let you choose the color of the background of the chat."
                  accessibilityRole="button"
                  onPress={() => this.setState({ chatColor: CHAT_COLOR_1 })}
                  style={[
                    styles.backgroundColorButton,
                    styles.backgroundColor1,
                    this.state.chatColor === CHAT_COLOR_1 ? styles.backgroundColorButtonActive : null,
                  ]}
                />
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Choose color 2"
                  accessibilityHint="Let you choose the color of the background of the chat."
                  accessibilityRole="button"
                  onPress={() => this.setState({ chatColor: CHAT_COLOR_2 })}
                  style={[
                    styles.backgroundColorButton,
                    styles.backgroundColor2,
                    this.state.chatColor === CHAT_COLOR_2 ? styles.backgroundColorButtonActive : null,
                  ]}
                />
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Choose color 3"
                  accessibilityHint="Let you choose the color of the background of the chat."
                  accessibilityRole="button"
                  onPress={() => this.setState({ chatColor: CHAT_COLOR_3 })}
                  style={[
                    styles.backgroundColorButton,
                    styles.backgroundColor3,
                    this.state.chatColor === CHAT_COLOR_3 ? styles.backgroundColorButtonActive : null,
                  ]}
                />
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Choose color 4"
                  accessibilityHint="Let you choose the color of the background of the chat."
                  accessibilityRole="button"
                  onPress={() => this.setState({ chatColor: CHAT_COLOR_4 })}
                  style={[
                    styles.backgroundColorButton,
                    styles.backgroundColor4,
                    this.state.chatColor === CHAT_COLOR_4 ? styles.backgroundColorButtonActive : null,
                  ]}
                />
              </View>
            </View>
            {/* Button to enter the chat */}
            <View style={styles.innerBox}>
              <Button
                accessible={true}
                accessibilityLabel="Start Chatting"
                accessibilityHint="Let you start chatting."
                accessibilityRole="button"
                title="Start Chatting"
                style={[styles.gotoChatButton], { backgroundColor: this.state.chatColor }}
                onPress={() => this.props.navigation.navigate('ChatScreen', { userName: this.state.userName, chatColor: this.state.chatColor })}
              />
            </View>
          </View>
          <View style={styles.footerBox} />
        </View>
        {/* this is used to correct a glitch with the Android keyboard */}
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerBox: {
    height: '15%',
    width: '88%',
    alignItems: 'center',
  },
  titleBox: {
    height: '35%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
  },
  userBox: {
    height: '44%',
    width: '88%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: '6%',
  },
  innerBox: {
  },
  userNameInputbox: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderWidth: 1,
    borderColor: '#757083',
    padding: 10,
  },
  chooseBackgroundColorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
  },
  chooseBackgroundText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  backgroundColorButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 0,
  },
  backgroundColorButtonActive: {
    borderWidth: 5,
    borderColor: '#757083',
  },
  backgroundColor1: {
    backgroundColor: CHAT_COLOR_1,
  },
  backgroundColor2: {
    backgroundColor: CHAT_COLOR_2,
  },
  backgroundColor3: {
    backgroundColor: CHAT_COLOR_3,
  },
  backgroundColor4: {
    backgroundColor: CHAT_COLOR_4,
  },
  gotoChatButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
    padding: 10,
  },
  footerBox: {
    height: '6%',
    width: '88%',
  },
});
