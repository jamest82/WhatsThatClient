/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Button, Text, View, TextInput, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NewChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      chatName: 'New Chat'
    };
  }

  createChat = async () => {
    const { navigation } = this.props;
    const { chatName, error } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          name: chatName
        })
      }
    )
      .then((response) => {
        if (response.status === 201) {
          console.log('Created');
          return response.json();
        } else if (response.status === 400) {
          console.log('Bad Request');
          this.setState({ error: 'Bad Request' });
          throw error;
        } else if (response.status === 401) {
          console.log('Unauthorized');
          this.setState({ error: 'Unauthorized' });
          throw error;
        } else if (response.status === 500) {
          console.log('Server Error');
          this.setState({ error: 'Server Error' });
          throw error;
        } else {
          this.setState({ error: 'Server Error' });
          throw error;
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        try {
          await AsyncStorage.setItem('whatsthat_chat_id', responseJson.chat_id);
          navigation.navigate('SingularChat');
        } catch {
          this.setState({ error: 'Something Went Wrong' });
          throw error;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { chatName } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>Create Chat</Text>
          <Text>Name your new chat</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Chat"
              onChangeText={(varChatName) => this.setState({ chatName: varChatName })}
              defaultValue={chatName}
            />
          </View>
          <Button
            style={styles.button}
            title="Create Chat"
            onPress={() => this.createChat()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 800,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    width: '100%',
    height: 45,
    alignItems: 'center'
  },
  input: {
    height: 50,
    padding: 10
  },
  button: {
    marginTop: 10
  }

});
