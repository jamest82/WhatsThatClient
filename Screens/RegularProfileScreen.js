/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, Image, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RegularProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      firstName: '',
      lastName: '',
      photo: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserData();
    this.getProfileImage();
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

  getProfileImage = async () => {
    const id = await AsyncStorage.getItem('whatsthat_contact_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token
      }
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
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
    const {
      isLoading, firstName, lastName, photo
    } = this.state;
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
          <View>
            <View style={styles.center}>
              <Text style={styles.contactName}> You are not Friends</Text>
              <Image
                source={{
                  uri: photo
                }}
                style={{
                  width: 100,
                  height: 100
                }}
              />
            </View>
            <View style={styles.contactCards}>
              <Text style={styles.contactName}>
                {firstName}
              </Text>
              <Text style={styles.contactName}>
                {lastName}
              </Text>
            </View>
            <Button
              title="Add as a Contact"
              onPress={() => this.addContact()}
            />
            <View style={styles.spacer} />
            <Button
              title="Contacts"
              onPress={() => navigation.navigate('ContactsList')}
            />
            <View style={styles.spacer} />
            <Button
              title="Search"
              onPress={() => navigation.navigate('Search')}
            />
          </View>
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
  contactCards: {
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactName: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  spacer: {
    marginTop: 5
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
