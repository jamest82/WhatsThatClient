import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SingleProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          blocked: false,
          friend: false,
          contactsData: [],
          blockedData: [],
          profileId: '',
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
              last_name: responseJson.last_name
            });
        

        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

    getContacts = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/contacts',
        { 
            method: 'get',
            headers: { 'X-Authorization': token }
        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              contactsData: responseJson,
            });
        
            console.log(this.state.contactsData)
            this.doContactCheck();

        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

    doContactCheck = async () => {
        await this.state.contactsData.forEach(element => {
            console.log(element.user_id);
            console.log(this.state.profileId);
            if (parseInt(element.user_id) === parseInt(this.state.profileId)){
                console.log('in contacts');
                this.setState({
                    friend: true
                })
            }
        });
        
    }

    //Blocked Check

    getBlocked = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/blocked',
        { 
            method: 'get',
            headers: { 'X-Authorization': token }
        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              blockedData: responseJson,
            });
        
            console.log(this.state.blockedData)
            this.doBlockCheck();

        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

    doBlockCheck = async () => {
        await this.state.blockedData.forEach(element => {
            console.log(element.user_id);
            console.log(this.state.profileId);
            if (parseInt(element.user_id) === parseInt(this.state.profileId)){
                console.log('in blocked');
                this.setState({
                    Blocked: true
                })
            } 
        });
        if (!this.state.blocked) {
            console.log('not blocked')
        }
        this.setState({
            isLoading: false,
        })
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getUserData();
        this.getContacts();
        this.getBlocked();
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
          }else if (this.state.friend){
            return(
                <View>
                    <Text> You are Friends</Text>
                    <Text> {this.state.first_name} </Text>
                    <Text> {this.state.last_name} </Text>
                </View>
            );
            } else if (this.state.blocked){
                return(
                    <View>
                        <Text> User is blocked</Text>
                    </View>
                )
            } else {
                return(
                    <View>
                        <Text> User is neither friend or blocked</Text>
                    </View>
                )
            }
    }
}