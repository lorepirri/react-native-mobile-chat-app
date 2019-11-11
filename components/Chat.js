import React, { Component } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from "react-native-keyboard-spacer";

// this class implements the main chat screen
export default class Chat extends Component {

  constructor(props){
    super(props);
    // state set with an empty list of messages
    this.state = {
      messages: []
    };
  }


  static navigationOptions = ({ navigation }) => {
    // set the title of the navigation bar with the one passed as prop to navigate() in Start.js
    return {
      title: navigation.state.params.userName,
    };
  };

  componentDidMount() {
    // at componentDidMount, set two messages, one system and one as welcome from a user
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${this.props.navigation.state.params.userName}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
         _id: 2,
         text: `${this.props.navigation.state.params.userName} has entered this chat.`,
         createdAt: new Date(),
         system: true,
        },        
      ],
    })
  }

  onSend(messages = []) {
    // on send, append the new message to the previous ones
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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