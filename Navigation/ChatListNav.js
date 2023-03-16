import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import AllChatsScreen from '../Screens/AllChatsScreen';
import NewChatScreen from '../Screens/NewChatScreen';
import SingularChatScreen from '../Screens/SingularChatScreen';
import AddToChatScreen from '../Screens/AddToChatScreen';
import ChatDetailsScreen from '../Screens/ChatDetailsScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const ChatStack = createNativeStackNavigator();

export default class ChatListNav extends Component {

    render(){
        return(
            <View>
                <ChatStack.Navigator 
                initialRouteName="AllChats"
                screenOptions={{headerShown: false}}>
                    <ChatStack.Screen name="AllChats" component={AllChatsScreen} />
                    <ChatStack.Screen name="NewChat" component={NewChatScreen} />
                    <ChatStack.Screen name="SingularChat" component={SingularChatScreen} />
                    <ChatStack.Screen name="AddToChat" component={AddToChatScreen} />
                    <ChatStack.Screen name="ChatDetails" component={ChatDetailsScreen} />
                </ChatStack.Navigator>
            </View>
        );
    }
}