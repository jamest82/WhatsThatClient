import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatDetailsScreen extends Component {

    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          chatData: [],
          submitted: false,
          id:'',
          token:'',
          chatName:''

        }

        
      }

    changeName = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.id,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        'X-Authorization': token },
            body: JSON.stringify({
                name: this.state.chatName
              })
        })
        .then((response) => {
            if (response.status === 200){
                console.log("Name Changed");
                this.getChatData();
            } else if (response.status === 400){
                console.log("Bad Request");
            } else if (response.status === 401){
                console.log("Unauthorized");
            } else if (response.status === 403){
                console.log("Forbidden");
            } else if (response.status === 404){
                console.log("Not Found");
            } else if (response.status === 500){
                console.log("Server Error");
            }
        })
    }

    removeUser = async (user_id) => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.id + '/user/' + user_id,
        { 
            method: 'delete',
            headers: { 'X-Authorization': token }
        })
        .then((response) => {
            if (response.status === 200){
            console.log("User Removed");
            this.getChatData();
            } else if (response.status === 401){
                console.log("Unauthorised")
                this.setState({submitted: false})
            } else if (response.status === 403){
                console.log("Forbidden")
                this.setState({submitted: false})
            } else if (response.status === 404){
                console.log("Not Found")
                this.setState({submitted: false})
            } else{
                console.log("server error")
                this.setState({submitted: false})
            }
        })
    }

    getChatData = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.id,
        { 
            method: 'get',
            headers: { 'X-Authorization': token }

        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              isLoading: false,
              chatData: responseJson,
            });
        
            console.log(this.state.chatData)
        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

        getChatId = async () =>{
            this.state.id = await AsyncStorage.getItem('whatsthat_chat_id')
        }

        componentDidMount(){
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
                this.checkLoggedIn();
            });
            this.getChatId();
            this.getChatData();
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
        if(this.state.isLoading){
            return(
              <View>
                <ActivityIndicator/>
              </View>
            )
          }else{
      
          return(
            <View>
                <Text>Chat Name:</Text>
                <TextInput
                        placeholder= {this.state.chatData.name}
                        onChangeText={chatName => this.setState({chatName})}
                        value={this.state.chatName}
                        />
                <Button
                title="Change Chat Name"
                onPress={() => this.changeName()}
                />
                <Text>Created By: {this.state.chatData.creator.first_name + ' ' + this.state.chatData.creator.last_name} </Text>
                <Text>Members:  </Text>
                <FlatList 
                data={this.state.chatData.members}
                renderItem={({item}) => (
                    <View>
                            <Text>{item.first_name + ' ' + item.last_name}</Text>
                            <Button 
                            title="remove"
                            onPress={() => this.removeUser(item.user_id)}
                            />
                    </View>
                )}
                keyExtractor={({user_id}, index) => user_id}
                />
            </View>
        );
    }
}}