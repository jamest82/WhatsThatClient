import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactsScreen from '../Screens/ContactsScreen';
import BlockedScreen from '../Screens/BlockedScreen';
import SearchScreen from '../Screens/SearchScreen';
import ContactProfileScreen from '../Screens/ContactProfileScreen';
import BlockedProfileScreen from '../Screens/BlockedProfileScreen';
import RegularProfileScreen from '../Screens/RegularProfileScreen';

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
                    <ContactStack.Screen name="Search" component={SearchScreen} />
                    <ContactStack.Screen name="ContactProfile" component={ContactProfileScreen} />
                    <ContactStack.Screen name="RegularProfile" component={RegularProfileScreen} />
                    <ContactStack.Screen name="BlockedProfile" component={BlockedProfileScreen} />
                </ContactStack.Navigator>
            </View>
        );
    }
}