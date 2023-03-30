/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LogOutScreen from '../Screens/LogOutScreen';
import AccountDetailsScreen from '../Screens/AccountDetailsScreen';
import CameraScreen from '../Screens/CameraScreen';
// import UpdateAccountScreen from '../Screens/UpdateAccountScreen';

// <AccountStack.Screen name="LogOut" component={LogOutScreen} />
// <AccountStack.Screen name="UpdateAccount" component={UpdateAccountScreen} />
const AccountStack = createNativeStackNavigator();

export default class AccountNav extends Component {
  render() {
    return (
      <View>
        <AccountStack.Navigator initialRouteName="AccountDetails" screenOptions={{ headerShown: false }}>
          <AccountStack.Screen name="AccountDetails" component={AccountDetailsScreen} />
          <AccountStack.Screen name="Camera" component={CameraScreen} />
        </AccountStack.Navigator>
      </View>
    );
  }
}
