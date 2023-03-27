import React, { Component } from 'react';
import { Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class BlockedScreen extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          blockedData: []
        }
    }

    onCardPress = async (id) => {
        console.log("Touched " + id)
        await AsyncStorage.setItem("whatsthat_contact_id", id)
        this.props.navigation.navigate('BlockedProfile')
    }

    getData = async () => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch('http://localhost:3333/api/1.0.0/blocked',
        { 
            method: 'get',
            headers: { 'X-Authorization': token }
        })
          .then((response) => response.json())
          .then((responseJson) => {
        
           this.setState({
              isLoading: false,
              blockedData: responseJson,
            });
        
            console.log(this.state.blockedData)
        
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
                data={this.state.blockedData}
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
                title="Contacts"
                onPress={() => this.props.navigation.navigate('ContactsList')}
                />
                <Button
                title="Search"
                onPress={() => this.props.navigation.navigate('Search')}
                />
            </View>
    )}
}
}