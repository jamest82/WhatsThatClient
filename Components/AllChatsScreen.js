import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Button, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AllChatsScreen extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          chatData: []
        }

        this.onCardPress = this.onCardPress.bind(this)
      }
    
    onCardPress = async (id) => {
        console.log("Touched " + id)
        await AsyncStorage.setItem("whatsthat_chat_id", id)
        this.props.navigation.navigate('SingularChat')
    }

    getData = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch('http://localhost:3333/api/1.0.0/chat',
    { 
        method: 'get',
        headers: { 'X-Authorization': value }
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

    removeIdStorage = async () => {
        await AsyncStorage.removeItem('whatsthat_chat_id')
    }

      componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getData();
        this.removeIdStorage();
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
              <FlatList
                data={this.state.chatData}
                renderItem={({item}) => (
                  <View>
                    <TouchableOpacity onPress={() => this.onCardPress(item.chat_id)}>
                        <Text>{item.name}</Text>
                        <Text>{item.last_message.message}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={({chat_id}, index) => chat_id}
              />
              <Button
                title="New Chat"
                onPress={() => this.props.navigation.navigate('NewChat')}
                />
            </View>
    )}
}}