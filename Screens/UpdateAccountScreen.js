/* eslint-disable no-use-before-define */
/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, Text, View, TextInput, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

export default class UpdateAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      originalData: {},
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: ''
    };
  }

  componentDidMount() {
    const { navigation, route } = this.props;
    this.setState({
      originalData: route.params.data,
      firstName: route.params.data.first_name,
      lastName: route.params.data.last_name,
      email: route.params.data.email
    }, () => {
      console.log(this.state);
    });
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

  updateProfile = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    const {
      originalData, firstName, lastName, email, password
    } = this.state;
    const data = {};

    if (firstName !== originalData.first_name) {
      data['first_name'] = firstName;
    }

    if (lastName !== originalData.last_name) {
      data['last_name'] = lastName;
    }

    if (email !== originalData.email) {
      if (!EmailValidator.validate(email)) {
        this.setState({ error: 'Must enter valid email' });
      } else {
        data['email'] = email;
      }
    }

    if (password !== '') {
      const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if (!PASSWORD_REGEX.test(password)) {
        this.setState({ error: 'Password isnt strong enough (One upper, one lower, one symbol, one number, at least 8 characters long)' });
      } else {
        data['password'] = password;
      }
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${originalData.user_id}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('user updated');
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
    const {
      firstName, lastName, email, password
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Update Profile</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={(val) => this.setState({ firstName: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={(val) => this.setState({ lastName: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(val) => this.setState({ email: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            value={password}
            onChangeText={(val) => this.setState({ password: val })}
          />
        </View>
        <Button
          title="Update"
          onPress={() => this.updateProfile()}
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
