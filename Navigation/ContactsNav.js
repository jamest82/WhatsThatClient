import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactsScreen from '../Screens/ContactsScreen';
import BlockedScreen from '../Screens/BlockedScreen';
import SingleProfileScreen from '../Screens/SingleProfileScreen';
import SearchScreen from '../Screens/SearchScreen';

const ContactStack = createNativeStackNavigator();

export default class ContactsNav extends Component {

    render(){
        return(
            <View>
                <ContactStack.Navigator 
                initialRouteName="Contacts"
                screenOptions={{headerShown: false}}>
                    <ContactStack.Screen name="ContactsList" component={ContactsScreen} />
                    <ContactStack.Screen name="Blocked" component={BlockedScreen} />
                    <ContactStack.Screen name="SingleProfile" component={SingleProfileScreen} />
                    <ContactStack.Screen name="Search" component={SearchScreen} />
                </ContactStack.Navigator>
            </View>
        );
    }
}