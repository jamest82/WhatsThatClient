/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class BlockedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      blockedData: []
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
    navigation.navigate('BlockedProfile');
  };

  getData = async () => {
    const { blockedData } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch(
      'http://localhost:3333/api/1.0.0/blocked',
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          blockedData: responseJson
        });
        console.log(blockedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  removeContactStorage = async () => {
    await AsyncStorage.removeItem('whatsthat_contact_id');
  };

  render() {
    const { navigation } = this.props;
    const { isLoading, blockedData } = this.state;
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
            data={blockedData}
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
            title="Contacts"
            onPress={() => navigation.navigate('ContactsList')}
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
