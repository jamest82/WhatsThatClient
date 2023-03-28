/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RegularProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      firstName: '',
      lastName: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserData();
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

  getUserData = async () => {
    const value = await AsyncStorage.getItem('whatsthat_contact_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${value}`,
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          isLoading: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addContact = async () => {
    const { navigation } = this.props;

    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const contact = await AsyncStorage.getItem('whatsthat_contact_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${contact}/contact`,
      {
        method: 'post',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('contact added');
          navigation.navigate('ContactProfile');
        } else if (response.status === 400) {
          console.log('You cant add yourself');
        } else if (response.status === 401) {
          console.log('Unauthorised');
        } else if (response.status === 404) {
          console.log('Not Found');
        } else {
          console.log('server error');
        }
      });
  };

  render() {
    const { isLoading, firstName, lastName } = this.state;
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
          <Text> You are not Friends</Text>
          <Text>
            {firstName}
          </Text>
          <Text>
            {lastName}
          </Text>
          <Button
            title="Add as a Contact"
            onPress={() => this.addContact()}
          />
          <Button
            title="Contacts"
            onPress={() => navigation.navigate('ContactsList')}
          />
          <Button
            title="Search"
            onPress={() => navigation.navigate('Search')}
          />
        </View>
      );
    }
  }
}
