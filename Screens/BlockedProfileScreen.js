import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ContactProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          profileId: '',
          first_name: '',
          last_name: ''
        }
    }

    getUserData = async () => {
        const value = await AsyncStorage.getItem('whatsthat_contact_id');
        this.setState({
            profileId: value
        })
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.profileId,
        { 
            method: 'get',
            headers: { 'X-Authorization': token }
        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              first_name: responseJson.first_name,
              last_name: responseJson.last_name,
              isLoading: false
            });
        

        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

    unblockContact = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        const contact = await AsyncStorage.getItem('whatsthat_contact_id')
        return fetch('http://localhost:3333/api/1.0.0/user/' + contact + '/block',
        { 
            method: 'delete',
            headers: { 'X-Authorization': token }
        })
        .then((response) => {
            if (response.status === 200){
                console.log("contact unblocked");
                this.props.navigation.navigate('ContactProfile')
            } else if (response.status === 400){
                console.log("You cant remove yourself")
            } else if (response.status === 401){
                console.log("Unauthorised")
            } else if (response.status === 404){
                console.log("Not Found")
            } else{
                console.log("server error")
            }
        })
    
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getUserData();
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
          }else {
            return(
                <View>
                    <Text> User is Blocked</Text>
                    <Text> {this.state.first_name} </Text>
                    <Text> {this.state.last_name} </Text>
                    <Button
                        title="Unblock"
                        onPress={() => this.unblockContact()}
                    />
                    <Button
                        title="Contacts"
                        onPress={() => this.props.navigation.navigate('ContactsList')}
                    />
                    <Button
                        title="Search"
                        onPress={() => this.props.navigation.navigate('Search')}
                    />
                </View>
            );
                
        }
    }
}