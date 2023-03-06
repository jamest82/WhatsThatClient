import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import ChatListScreen from './ChatListScreen';
import ContactListScreen from './ContactListScreen';
import AccountDetailsScreen from './AccountDetailsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

class MainAppAuthScreen extends Component{
    
    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
    }
               
  render(){
    return(
            <Tab.Navigator
            initialRouteName='Chats'>
                <Tab.Screen name="Chats" component={ChatListScreen} />
                <Tab.Screen name="Contacts" component={ContactListScreen} />
                <Tab.Screen name="Account" component={AccountDetailsScreen} />
             </Tab.Navigator>
    );
  }
}

export default MainAppAuthScreen;