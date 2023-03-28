/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import {
  FlatList, ActivityIndicator, Button, Text, View, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AllChatsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatData: []
    };

    this.removeIdStorage = this.removeIdStorage.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
    this.removeIdStorage();
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

  onCardPress = async (id) => {
    const { navigation } = this.props;
    console.log(`Touched  ${id}`);
    await AsyncStorage.setItem('whatsthat_chat_id', id);
    navigation.navigate('SingularChat');
  };

  getData = async () => {
    const { chatData } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chatData: responseJson
        });
        console.log(chatData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line class-methods-use-this
  async removeIdStorage() {
    await AsyncStorage.removeItem('whatsthat_chat_id');
  }

  render() {
    const { isLoading, chatData } = this.state;
    const { navigation } = this.props;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <FlatList
            data={chatData}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => this.onCardPress(item.chat_id)}>
                  <Text>{item.name}</Text>
                  <Text>{item.last_message.message}</Text>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ chat_id }) => chat_id}
          />
          <Button
            title="New Chat"
            onPress={() => navigation.navigate('NewChat')}
          />
        </View>
      );
    }
  }
}
