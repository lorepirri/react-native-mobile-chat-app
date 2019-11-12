import React, { Component } from 'react';
import { StyleSheet, Platform, View, Text, AsyncStorage, NetInfo } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from "react-native-keyboard-spacer";

import config from "../config";
const firebase = require('firebase');
require('firebase/firestore');


// this class implements the main chat screen
export default class Chat extends Component {

  static navigationOptions = ({ navigation }) => {
    // set the title of the navigation bar with the one passed as prop to navigate() in Start.js
    return {
      title: navigation.state.params.userName,
      headerStyle: {
        backgroundColor: navigation.state.params.bgColor
      }
    };
  };

  constructor(props){
    super(props);

    // init firestore with credential from config (not on git)
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } 

    // connect collection of messages from firestore
    this.referenceMessages = firebase.firestore().collection('messages');

    // state set with an empty list of messages, user id
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
    };
  }

  async getMessages() {
    // load the messages from asyncStorage
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {

    // check if the user is online or not
    NetInfo.isConnected.fetch().then(isConnected => {
      // if there is internet connection, fetch the messages from the online storage
      if (isConnected) {
        console.log('online');
        // set the callback for when the user is signed in
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            // set the user id
            this.setState({
              uid: user.uid,
              isConnected: true,
            });

            // subscribe to updates on the collection and store the reference to unsubscribe
            // on componentWillUnmount
            this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
          } else {
            // request an anonymous sign in (onAuthStateChanged will be fired again)
            firebase.auth().signInAnonymously();
          }
        });

      } else {
        console.log('offline');
        // set online/offline status
        this.setState({
          isConnected: false,
        });      
        // load the messages from asyncStorage (local storage)
        this.getMessages();
      }

    });
  }

  componentWillUnmount() {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    // Whenever something changes in the "messages" collection (therefore, when onSnapshot() is fired)
    // this function is called (set in componentDidMount), and retrieves the current data in the 
    // messages collection and store it in the state.

    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      });
    });
    this.setState({ 
      messages,
   });
  }

   
  addMessage(messages) {
    console.log(this.props.navigation.state.params.userName);
    this.referenceMessages.add({
      _id: messages[0]._id,
      createdAt: messages[0].createdAt,
      text: messages[0].text,
      user: {
        _id :this.state.uid,
        name: this.props.navigation.state.params.userName
      }
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    // on send, append the new message to the previous ones
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      // this gets called after the state is updated

      // save messages to the online storage
      this.addMessage(messages);
      // store messages in the local storage
      this.saveMessages()
    });
  }

  // only for development (to clear the storage)
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  // handler to customize the input bar (do not show it if offline)
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }  

  // handler to customize the bubbles (left, right)
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'white'
          },
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    )
  }  

  render() {
    
    return (
      // main container must have flex:1 to be width/height 100%
      // also, uses the color chosen by the user and sent as prop from navigate() in Start.js
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.chatColor}}>
        <Text style={{}}>Welcome {this.props.navigation.state.params.userName}, you are {this.state.isConnected?'Online':'Offline'}</Text>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: this.props.navigation.state.params.userName,
          }}
        />
      {/* this is used to correct a glitch with the Android keyboard */}
      {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
})