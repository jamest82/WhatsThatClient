import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add styling
//Red errors, etc
export default class LoginScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "",
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
        this._signIn = this._signIn.bind(this)
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        if (value != null) {
            this.props.navigation.navigate('MainApp')
        }
    }

    _signIn(){
        return fetch("http://localhost:3333/api/1.0.0/login",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
          })
        })
        .then((response) => {
            if (response.status === 200){
            console.log("Signed In");
            this.setState({error: "Signed in successfully"})
            return response.json()
            } else if (response.status === 400){
                console.log("Invalid email/password")
                this.setState({error: "Invalid Email or Password"})
                this.setState({submitted: false})
            } else{
                console.log("server error")
                this.setState({submitted: false})
            }
        })
        .then(async (rJson) => {
            console.log(rJson)
            console.log(rJson.id)
            console.log(rJson.token)
            try{
                await AsyncStorage.setItem("whatsthat_user_id", rJson.id)
                await AsyncStorage.setItem("whatsthat_session_token", rJson.token)
                
                this.setState({submitted: false});

                this.props.navigation.navigate("MainApp")
            }catch{
                throw console.log("something went wrong")
            }
        })
        .catch((error) => {
          console.error(error);
          this.setState({submitted: false})
        });
      }
    
    _onPressButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.email && this.state.password)){
            this.setState({error: "Must enter email and password"})
            return;
        }

        if(!EmailValidator.validate(this.state.email)){
            this.setState({error: "Must enter valid email"})
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isnt strong enough (One upper, one lower, one symbol, one number, at least 8 characters long)"})
            return;
        }

        console.log("Button clicked: " + this.state.email + " " + this.state.password);
        console.log("ready to send to API");
        this._signIn();

    }

    render(){
        return ( 
            <View>
                <View>
                    <View>
                        <Text> Email:</Text>
                        <TextInput
                        placeholder="Enter email"
                        onChangeText={email => this.setState({email})}
                        defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text> *Email required</Text>
                            }
                        </>
                    </View>
                    <View>
                        <Text>Password:</Text>
                        <TextInput
                            placeholder="Enter password"
                            onChangeText={password => this.setState({password})}
                            defaultValue={this.state.password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                            <Text>*Password Required</Text>
                            }
                        </>
                    </View>
                    <View>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View>
                                <Text>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                            {this.state.error &&
                                <Text>{this.state.error}</Text>
                            }
                    </>

                    <View>
                        <Button
                            title="Need an account"
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        />
                    </View>
                </View>
            </View>
        )
    }
}