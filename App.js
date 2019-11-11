import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// import the two screens Start and Chat
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

// Create the navigator
const navigator = createStackNavigator(
  {
    StartScreen: { screen: StartScreen, headerMode: 'none' },
    ChatScreen: { screen: ChatScreen }
  },
  {
    initialRouteName: 'StartScreen',
  }
);

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
