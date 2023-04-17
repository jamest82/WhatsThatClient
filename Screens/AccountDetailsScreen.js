/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AccountDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      firstName: '',
      lastName: '',
      email: '',
      userData: {},
      photo: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getAccountData();
      this.getProfileImage();
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

  getAccountData = async () => {
    const value = await AsyncStorage.getItem('whatsthat_user_id');
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
          userData: responseJson,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
          isLoading: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfileImage = async () => {
    const id = await AsyncStorage.getItem('whatsthat_user_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token
      }
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  render() {
    const { navigation } = this.props;
    const {
      isLoading, firstName, lastName, email, userData, photo
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
          <Image
            source={{
              uri: photo
            }}
            style={{
              width: 100,
              height: 100
            }}
          />
          <Text>
            {firstName}
          </Text>
          <Text>
            {lastName}
          </Text>
          <Text>
            {email}
          </Text>
          <Button
            title="Update Profile"
            onPress={() => navigation.navigate('UpdateAccount', { data: userData })}
          />
          <Button
            title="Camera"
            onPress={() => navigation.navigate('Camera')}
          />
          <Button
            title="Log Out"
            onPress={() => navigation.navigate('LogOut')}
          />
        </View>
      );
    }
  }
}
