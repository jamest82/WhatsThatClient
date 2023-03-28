/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button
} from 'react-native';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false
    };

    this.onPressButton = this.onPressButton.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onPressButton() {
    const { email, password } = this.state;
    this.setState({ submitted: true });
    this.setState({ error: '' });
    if (!(email && password)) {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!EmailValidator.validate(email)) {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(password)) {
      this.setState({ error: 'Password isnt strong enough (One upper, one lower, one symbol, one number, at least 8 characters long)' });
      return;
    }

    console.log(`Button clicked: ${email} ${password}`);
    console.log('ready to send to API');
    this.signIn();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value != null) {
      navigation.navigate('MainApp');
    }
  };

  signIn() {
    const { navigation } = this.props;
    const { email, password, error } = this.state;
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Signed In');
          this.setState({ error: 'Signed in successfully' });
          return response.json();
        } else if (response.status === 400) {
          console.log('Invalid email/password');
          this.setState({
            error: 'Invalid Email or Password',
            submitted: false
          });
          throw error;
        } else {
          console.log('server error');
          this.setState({
            error: 'Server Error',
            submitted: false
          });
          throw error;
        }
      })
      .then(async (rJson) => {
        console.log(rJson);
        console.log(rJson.id);
        console.log(rJson.token);
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);
          this.setState({ submitted: false });
          navigation.navigate('MainApp');
        } catch {
          throw console.log('something went wrong');
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ submitted: false });
      });
  }

  render() {
    const { navigation } = this.props;
    const {
      email, submitted, password, error
    } = this.state;
    return (
      <View>
        <View>
          <View>
            <Text> Email:</Text>
            <TextInput
              placeholder="Enter email"
              onChangeText={(varEmail) => this.setState({ email: varEmail })}
              defaultValue={email}
            />

            {submitted && !email
            && <Text> *Email required</Text> }

          </View>
          <View>
            <Text>Password:</Text>
            <TextInput
              placeholder="Enter password"
              onChangeText={(varPass) => this.setState({ password: varPass })}
              defaultValue={password}
              secureTextEntry
            />
            {submitted && !password
            && <Text>*Password Required</Text>}
          </View>
          <View>
            <TouchableOpacity onPress={this.onPressButton}>
              <View>
                <Text>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          {error
          && <Text>{error}</Text>}
          <View>
            <Button
              title="Need an account"
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </View>
    );
  }
}
