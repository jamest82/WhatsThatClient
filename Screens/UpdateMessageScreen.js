/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unused-state */
/* eslint-disable dot-notation */
/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, TextInput, StyleSheet
} from 'react-native';

export default class SingularChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messageBody: '',
      newMessageBody: '',
      messageId: '',
      error: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getMessageDetails();
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

  getMessageDetails = async () => {
    const id = await AsyncStorage.getItem('whatsthat_message_id');
    const body = await AsyncStorage.getItem('whatsthat_message_body');

    this.setState({
      messageBody: body,
      newMessageBody: body,
      messageId: id,
      isLoading: false
    });
  };

  updateMessage = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    const chatId = await AsyncStorage.getItem('whatsthat_chat_id');
    const {
      messageBody, newMessageBody, messageId
    } = this.state;
    const data = {};

    if (newMessageBody !== messageBody) {
      data['message'] = newMessageBody;
    } else {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        error: 'The message body is the same'
      });
    }

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('message updated');
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'Something went wrong';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteMessage = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const chatId = await AsyncStorage.getItem('whatsthat_chat_id');
    const { messageId } = this.state;

    console.log(`deleting ${chatId} from ${messageId}`);

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('message deleted');
          navigation.navigate('SingularChat');
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'Something went wrong';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { newMessageBody, isLoading } = this.state;
    const { navigation } = this.props;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Update your message:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessageBody}
              onChangeText={(val) => this.setState({ newMessageBody: val })}
            />
          </View>
          <Button
            title="Update"
            onPress={() => this.updateMessage()}
          />
          <View style={styles.spacer} />
          <Button
            title="Delete Message"
            onPress={() => this.deleteMessage()}
          />
          <View style={styles.spacer} />
          <Button
            title="Return to chats"
            onPress={() => navigation.navigate('SingularChat')}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 800,
    backgroundColor: 'lightblue',
    justifyContent: 'center'
  },
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    width: '100%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center'
  },
  input: {
    height: 50,
    width: 300,
    padding: 10,
    alignItems: 'center'
  },
  issue: {
    color: 'red'
  },
  title: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  spacer: {
    marginTop: 5
  }
});
