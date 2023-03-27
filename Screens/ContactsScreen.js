import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class ContactsScreen extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          contactsData: []
        }
    }

    onCardPress = async (id) => {
        console.log("Touched " + id)
        await AsyncStorage.setItem("whatsthat_contact_id", id)
        this.props.navigation.navigate('ContactProfile')
    }

    getData = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/contacts',
        { 
            method: 'get',
            headers: { 'X-Authorization': token }
        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              isLoading: false,
              contactsData: responseJson,
            });
        
            console.log(this.state.contactsData)
        
          })
          .catch((error) =>{
            console.log(error);
          });
        }

        removeContactStorage = async () => {
            await AsyncStorage.removeItem('whatsthat_contact_id')
        }

        componentDidMount(){
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
                this.checkLoggedIn();
                this.getData();
                this.removeContactStorage();
            });
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
                data={this.state.contactsData}
                renderItem={({item}) => (
                  <View>
                    <TouchableOpacity onPress={() => this.onCardPress(item.user_id)}>
                        <Text>{item.first_name + ' ' +item.last_name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={({user_id}, index) => user_id}
              />
              <Button
                title="Blocked"
                onPress={() => this.props.navigation.navigate('Blocked')}
                />
                <Button
                title="Search"
                onPress={() => this.props.navigation.navigate('Search')}
                />
            </View>
    )}
}
}