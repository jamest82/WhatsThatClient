/* eslint-disable react/prop-types */
/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
      this.removeContactStorage();
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

  onCardPress = async (id) => {
    const { navigation } = this.props;
    console.log(`Touched ${id}`);
    await AsyncStorage.setItem('whatsthat_contact_id', id);
    navigation.navigate('ContactProfile');
  };

  getData = async () => {
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

  // eslint-disable-next-line class-methods-use-this
  removeContactStorage = async () => {
    await AsyncStorage.removeItem('whatsthat_contact_id');
  };

  render() {
    const { navigation } = this.props;
    const { isLoading, contactsData } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View style={styles.contactCards}>
                <TouchableOpacity onPress={() => this.onCardPress(item.user_id)}>
                  <Text style={styles.contactName}>{`${item.first_name} ${item.last_name}`}</Text>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
          <Button
            title="Blocked"
            onPress={() => navigation.navigate('Blocked')}
          />
          <View style={styles.spacer} />
          <Button
            title="Search"
            onPress={() => navigation.navigate('Search')}
          />
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
  }
});
