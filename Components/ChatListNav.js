import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import AllChatsScreen from './AllChatsScreen';
import NewChatScreen from './NewChatScreen';
import SingularChatScreen from './SingularChatScreen';
import AddToChatScreen from './AddToChatScreen';
import ChatDetailsScreen from './ChatDetailsScreen';

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