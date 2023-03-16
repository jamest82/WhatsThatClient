import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import ChatListNav from './ChatListNav';
import ContactsNav from './ContactsNav';
import AccountNav from './AccountNav';
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
                <Tab.Screen name="Chats" component={ChatListNav} options={{ tabBarLabel: 'Chats' }}/>
                <Tab.Screen name="Contacts" component={ContactsNav} options={{ tabBarLabel: 'Contacts' }}/>
                <Tab.Screen name="Account" component={AccountNav} options={{ tabBarLabel: 'Account' }}/>
             </Tab.Navigator>
    );
  }
}

export default MainAppAuthScreen;