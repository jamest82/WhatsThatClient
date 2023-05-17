/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatListNav from './ChatListNav';
import ContactsNav from './ContactsNav';
import AccountNav from './AccountNav';

const Tab = createBottomTabNavigator();

class MainAppAuthScreen extends Component {
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

  render() {
    return (
      <Tab.Navigator initialRouteName="Chats" screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Chats" component={ChatListNav} options={{ tabBarLabel: 'Chats' }} />
        <Tab.Screen name="Contacts" component={ContactsNav} options={{ tabBarLabel: 'Contacts' }} />
        <Tab.Screen name="Account" component={AccountNav} options={{ tabBarLabel: 'Account' }} />
      </Tab.Navigator>
    );
  }
}

export default MainAppAuthScreen;
