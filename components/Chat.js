import React, { Component } from 'react';
import {
  StyleSheet, Platform, View, Text, AsyncStorage, NetInfo,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import MapView from 'react-native-maps';

import * as firebase from 'firebase';
import 'firebase/firestore';

import config from '../config';
import CustomActions from './CustomActions';

// this class implements the main chat screen
export default class Chat extends Component {
  /**
  * this sets the title in the navigation bar and its the color
  */
  static navigationOptions = ({ navigation }) => {
    // set the title of the navigation bar with the one passed as prop to navigate() in Start.js
    return {
      title: navigation.state.params.userName,
      headerStyle: {
        backgroundColor: navigation.state.params.bgColor,
      },
    };
  };

  constructor(props) {
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
      image: '',
    };
  }

  componentDidMount() {
    // check if the user is online or not
    NetInfo.isConnected.fetch().then((isConnected) => {
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

  /**
  * Whenever something changes in the "messages" collection
  * (therefore, when onSnapshot() is fired) this function
  * is called (set in componentDidMount), and retrieves the
  * current data in the messages collection and store it in the state.
  * @function onCollectionUpdate
  * @param {any} querySnapshot
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();

      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || '',
        location: data.location || null,
      });
    });
    // update the state with messages
    this.setState({
      messages,
    });
  }

  /**
  * When the user press 'send', the message is stored in the state
  * first, then sent online, and stored locally
  * @param messages the list of messages to send
  */
  onSend = (messages = []) => {
    // on send, append the new message to the previous ones
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      // this gets called after the state is updated

      // save messages to the online storage
      this.addMessage(messages);
      // store messages in the local storage
      this.saveMessages();
    });
  }

  /**
  * Load the messages from asyncStorage
  * @async
  */
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Store the messages online
  * @param messages the list of messages to store
  * @async
  */
  addMessage = async (messages) => {
    const message = messages[0];
    try {
      this.referenceMessages.add({
        _id: message._id,
        createdAt: message.createdAt,
        text: message.text || '',
        user: message.user,
        image: message.image || '',
        location: message.location || null,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Store the messages on the local store for offline mode
  * @async
  */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Clear the local storage. Only for development
  * @async
  */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Handler to customize the input bar (do not show it if offline)
  * @param props
  * @return InputToolbar
  */
  renderInputToolbar = (props) => {
    if (this.state.isConnected) {
      return (<InputToolbar {...props} />);
    }
    return (<></>);
  }

  /**
  * Handler to customize the bubbles (left, right)
  * @param props
  * @return Bubble
  */
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
          },
          right: {
            backgroundColor: 'blue',
          },
        }}
      />
    );
  }

  /**
  * Handler to render the actions (send image, location)
  * @param props
  * @return CustomActions
  */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
  * Handler to render the location as a map
  * @param props
  * @return MapView
  */
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      // main container must have flex:1 to be width/height 100%
      // also, uses the color chosen by the user and sent as prop from navigate() in Start.js
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.chatColor }}>
        <Text style={{}}>
          Welcome {this.props.navigation.state.params.userName}, you are {this.state.isConnected ? 'Online' : 'Offline'}
        </Text>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
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
});
