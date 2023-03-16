import React, { Component } from 'react';
import { Button, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NewChatScreen extends Component {

    constructor(props){
        super(props);
        this.state ={
            chatCreated: false,
            chatName: 'New Chat'
        }
    }

    createChat = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch("http://localhost:3333/api/1.0.0/chat",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                     'X-Authorization': token },
          body: JSON.stringify({
            name: this.state.chatName
          })
        })
        .then((response) => {
            if (response.status === 201){
                console.log("Created")
                return response.json()
            } else if (response.status === 400){
                console.log("Bad Request");
            } else if (response.status === 401){
                console.log("Unauthorized");
            } else if (response.status === 500){
                console.log("Server Error");
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson)
            try{
                await AsyncStorage.setItem("whatsthat_chat_id", responseJson.chat_id)
                
                this.props.navigation.navigate('SingularChat')
            }catch{
                throw "Something went wrong"
            }

        })
        .catch((error) => {
            console.log(error);
        })
    }
    render(){
            return(
            <View>
                <Text>Create Chat</Text>
                <Text>Name your new chat</Text>
                <TextInput
                    placeholder= 'New Chat'
                    onChangeText={chatName => this.setState({chatName})}
                    defaultValue={this.state.chatName}
                    />
                <Button
                    title="Create Chat"
                    onPress={() => this.createChat()}
                    />
            </View>
            )
    }
}