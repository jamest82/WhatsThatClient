/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet
} from 'react-native';
import * as EmailValidator from 'email-validator';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      error: '',
      submitted: false
    };

    this.onPressButton = this.onPressButton.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  onPressButton() {
    const {
      email, password, firstName, lastName
    } = this.state;
    this.setState({
      submitted: true,
      error: ''
    });

    if (!(email && password)) {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!(firstName && lastName)) {
      this.setState({ error: 'Must enter first and last name' });
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

    console.log(`Button clicked: ${email} ${password} ${firstName} ${lastName}`);
    console.log('Ready to send to API');
    this.signUp();
  }

  signUp() {
    const { navigation } = this.props;
    const {
      email, password, firstName, lastName
    } = this.state;
    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
      }
    )
      .then((response) => {
        if (response.status === 201) {
          console.log('Account Created');
          this.setState({
            error: 'Account Created Successfully',
            submitted: false
          });
          navigation.navigate('Login');
        } else if (response.status === 400) {
          console.log('Invalid email/password');
          this.setState({ submitted: false });
        } else {
          console.log('server error');
          this.setState({ submitted: false });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ submitted: false });
      });
  }

  render() {
    const { navigation } = this.props;
    const {
      email, password, firstName, lastName, submitted, error
    } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter first name"
              onChangeText={(varFName) => this.setState({ firstName: varFName })}
              defaultValue={firstName}
            />
            {submitted && !firstName
            && <Text style={styles.issue}> *First name required</Text>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter surname"
              onChangeText={(varLName) => this.setState({ lastName: varLName })}
              defaultValue={lastName}
            />
            {submitted && !lastName
            && <Text style={styles.issue}> *Surname required</Text>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter email"
              onChangeText={(varEmail) => this.setState({ email: varEmail })}
              defaultValue={email}
            />
            {submitted && !email
            && <Text style={styles.issue}> *Email required</Text>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter password"
              onChangeText={(varPass) => this.setState({ password: varPass })}
              defaultValue={password}
              secureTextEntry
            />
            {submitted && !password
            && <Text style={styles.issue}>*Password Required</Text>}
          </View>
          <View>
            <Button
              title="Register"
              onPress={() => this.onPressButton()}
            />
          </View>
          {error
          && <Text style={styles.issue}>{error}</Text>}
          <View>
            <Button
              title="Already have an account?"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'lightblue'
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
    flex: 1,
    padding: 10
  },
  issue: {
    color: 'red'
  }
});

export default SignUpScreen;
