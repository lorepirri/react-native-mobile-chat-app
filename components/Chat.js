import React, { Component } from 'react';
import { StyleSheet, Platform, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  render() {
    
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.chatColor}]}>
        <Text style={{color: 'white'}}>Hello {this.props.navigation.state.params.userName}!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    color: 'white'
  }
})