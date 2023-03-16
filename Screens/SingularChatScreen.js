import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TextInput } from 'react-native';

export default class SingularChatScreen extends Component {

    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          messageData: [],
          message: '',
          submitted: false,
          id:'',
          token:''

        }

        
      }

      onSendMessage = async () => {
        this.setState({submitted: true})
        console.log("Message to send " + this.state.message)
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.id + "/message",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                     'X-Authorization': token },
          body: JSON.stringify({
            message: this.state.message
          })
        })
        .then((response) => {
            if (response.status === 200){
            console.log("Message sent");
            this.getMessageData();
            this.setState({
                message: ''
            })
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

      getMessageData = async () => {
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
              messageData: responseJson,
              submitted: false
            });
        
            console.log(this.state.messageData)
        
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
            this.getMessageData();
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
                    <View>
                        <Button
                        title="Add a User"
                        onPress={() => this.props.navigation.navigate('AddToChat')}
                        />
                        <Button
                        title="Chat Details"
                        onPress={() => this.props.navigation.navigate('ChatDetails')}
                        />
                    </View>
                    <Text> {this.state.messageData.name}</Text>
                  <FlatList
                    data={this.state.messageData.messages}
                    inverted={true}
                    renderItem={({item}) => (
                      <View>
                        
                        {/*<TouchableOpacity onPress={() => }> */}
                            <Text>{item.author.first_name}</Text>
                            <Text>{item.message}</Text>
                        {/* </TouchableOpacity> */}
                      </View>
                    )}
                    keyExtractor={({message_id}, index) => message_id}
                  />
                  <TextInput
                        placeholder="Enter message"
                        onChangeText={message => this.setState({message})}
                        value={this.state.message}
                        />

                        <>
                            {this.state.submitted && !this.state.message &&
                                <Text> *Message is empty</Text>
                            }
                        </>
                  <Button
                    title="Send Message"
                    onPress={() => this.onSendMessage()}
                    />
                </View>
                );
                }
    }
}