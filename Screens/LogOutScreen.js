/* eslint-disable no-use-before-define */
/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, Text, View, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UpdateAccountScreen extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
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

  logOut = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Logged Out');
          AsyncStorage.removeItem('whatsthat_session_token');
          AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorized');
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
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Are you sure you want to log out?</Text>
        <Button
          title="Yes"
          onPress={() => this.logOut()}
        />
        <View style={styles.spacer} />
        <Button
          title="No"
          onPress={() => navigation.navigate('AccountDetails')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 800,
    backgroundColor: 'lightblue',
    justifyContent: 'center'
  },
  title: {
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
