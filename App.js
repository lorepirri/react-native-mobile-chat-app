
import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// import the two screens Start and Chat
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';

// Create the navigator
const navigator = createStackNavigator(
  {
    // Initial screen
    StartScreen: { screen: StartScreen },
    // The chat screen
    ChatScreen: { screen: ChatScreen }
  },
  {
    initialRouteName: 'StartScreen',
  }
);

const navigatorContainer = createAppContainer(navigator);

// Export it as the root component
export default navigatorContainer;
