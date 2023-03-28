/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatData: [],
      id: '',
      chatName: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getChatId(() => {
      this.getChatData();
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

  changeName = async () => {
    const { id, chatName } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}`,
      {
        method: 'PATCH',
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
        if (response.status === 200) {
          console.log('Name Changed');
          this.getChatData();
        } else if (response.status === 400) {
          console.log('Bad Request');
        } else if (response.status === 401) {
          console.log('Unauthorized');
        } else if (response.status === 403) {
          console.log('Forbidden');
        } else if (response.status === 404) {
          console.log('Not Found');
        } else if (response.status === 500) {
          console.log('Server Error');
        }
      });
  };

  removeUser = async (userId) => {
    const { id } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}/user/${userId}`,
      {
        method: 'delete',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('User Removed');
          this.getChatData();
        } else if (response.status === 401) {
          console.log('Unauthorised');
        } else if (response.status === 403) {
          console.log('Forbidden');
        } else if (response.status === 404) {
          console.log('Not Found');
        } else {
          console.log('server error');
        }
      });
  };

  getChatData = async () => {
    const { id, chatData } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    console.log(id);
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}`, //            i think that id isnt passing through here, must ask ash tuesday
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

  getChatId = async (done) => {
    const value = await AsyncStorage.getItem('whatsthat_chat_id');
    this.setState({
      id: value
    }, () => {
      done();
    });
  };

  render() {
    const { isLoading, chatData, chatName } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <Text>Chat Name:</Text>
          <TextInput
            placeholder={chatData.name}
            onChangeText={(val) => this.setState({ chatName: val })}
            value={chatName}
          />
          <Button
            title="Change Chat Name"
            onPress={() => this.changeName()}
          />
          <Text>{`Created By: ${chatData.creator.first_name} ${chatData.creator.last_name}`}</Text>
          <Text>Members:  </Text>
          <FlatList
            data={chatData.members}
            renderItem={({ item }) => (
              <View>
                <Text>{`${item.first_name} ${item.last_name}`}</Text>
                <Button
                  title="remove"
                  onPress={() => this.removeUser(item.user_id)}
                />
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
      );
    }
  }
}
