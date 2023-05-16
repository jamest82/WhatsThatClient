/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList, TextInput, TouchableOpacity
} from 'react-native';

export default class SingularChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messageData: [],
      message: '',
      submitted: false,
      id: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getChatId(() => {
        this.getMessageData();
        const interval = setInterval(() => {
          this.getMessageData();
        }, 1000);
        return () => clearInterval(interval);
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  onSendMessage = async () => {
    const { message, id } = this.state;
    this.setState({ submitted: true });
    console.log(`Message to send: ${message}`);
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          message
        })
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Message sent');
          this.getMessageData();
          this.setState({
            message: ''
          });
        } else if (response.status === 401) {
          console.log('Unauthorised');
          this.setState({ submitted: false });
        } else if (response.status === 403) {
          console.log('Forbidden');
          this.setState({ submitted: false });
        } else if (response.status === 404) {
          console.log('Not Found');
          this.setState({ submitted: false });
        } else {
          console.log('server error');
          this.setState({ submitted: false });
        }
      });
  };

  getMessageData = async () => {
    const { id } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}`,
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          messageData: responseJson,
          submitted: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getChatId = async (done) => {
    const value = await AsyncStorage.getItem('whatsthat_chat_id');
    this.setState({
      id: value
    }, () => {
      done();
    });
  };

  goToUpdate = async (id, message) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('whatsthat_message_id', id);
    await AsyncStorage.setItem('whatsthat_message_body', message);
    navigation.navigate('UpdateMessage');
  };

  render() {
    const { navigation } = this.props;
    const {
      isLoading, messageData, message, submitted
    } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <View>
            <Button
              title="Add a User"
              onPress={() => navigation.navigate('AddToChat')}
            />
            <Button
              title="Chat Details"
              onPress={() => navigation.navigate('ChatDetails')}
            />
          </View>
          <Text>
            {messageData.name}
          </Text>
          <FlatList
            data={messageData.messages}
            inverted
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => this.goToUpdate(item.message_id, item.message)}>
                  <Text>{item.author.first_name}</Text>
                  <Text>{item.message}</Text>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ message_id }) => message_id}
          />
          <TextInput
            placeholder="Enter message"
            onChangeText={(varMessage) => this.setState({ message: varMessage })}
            value={message}
          />
          {submitted && !message
            && <Text> *Message is empty</Text>}
          <Button
            title="Send Message"
            onPress={() => this.onSendMessage()}
          />
        </View>
      );
    }
  }
}
