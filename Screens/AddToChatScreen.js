/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList
} from 'react-native';

export default class AddToChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      id: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getChatId(() => {
      this.getContacts();
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

  getChatId = async (done) => {
    const value = await AsyncStorage.getItem('whatsthat_chat_id');
    this.setState({
      id: value
    }, () => {
      done();
    });
  };

  getContacts = async () => {
    const { contactsData } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          contactsData: responseJson
        });
        console.log(contactsData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addUser = async (userId) => {
    const { id } = this.state;
    console.log(`User to add: ${userId}`);
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${id}/user/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('User Added');
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

  render() {
    const { navigation } = this.props;
    const { contactsData, isLoading } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <Button
            title="Return"
            onPress={() => navigation.navigate('SingularChat')}
          />
          <Text>Add To Chat</Text>
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View>
                <Text>{`${item.first_name} ${item.last_name}`}</Text>
                <Button
                  title="+"
                  onPress={() => this.addUser(item.user_id)}
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
