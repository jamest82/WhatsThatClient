import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';

//styling needed
//Same as Login
//Lock inputs when submitting

class SignUpScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            error: "",
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
        this._signUp = this._signUp.bind(this)
    }

    _signUp(){
        return fetch("http://localhost:3333/api/1.0.0/user",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
          })
        })
        .then((response) => {
            if (response.status === 201){
            console.log("Account Created");
            this.setState({error: "Account Created Successfully"})
            this.setState({submitted: false})
            this.props.navigation.navigate("Login")
            } else if (response.status === 400){
                console.log("Invalid email/password")
                this.setState({submitted: false})
            } else{
                console.log("server error")
                this.setState({submitted: false})
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

        if(!(this.state.first_name && this.state.last_name)){
            this.setState({error: "Must enter first and last name"})
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

        console.log("Button clicked: " + this.state.email + " " + this.state.password + " " + this.state.first_name + " " + this.state.last_name);
        console.log("ready to send to API");
        this._signUp();

    }

  render(){
    return(
        <View>
                <View>
                    <View>
                        <Text> First Name:</Text>
                        <TextInput
                        placeholder="Enter first name"
                        onChangeText={first_name => this.setState({first_name})}
                        defaultValue={this.state.first_name}
                        />

                        <>
                            {this.state.submitted && !this.state.first_name &&
                                <Text> *First name required</Text>
                            }
                        </>
                    </View>
                    <View>
                        <Text> Surname:</Text>
                        <TextInput
                        placeholder="Enter surname"
                        onChangeText={last_name => this.setState({last_name})}
                        defaultValue={this.state.last_name}
                        />

                        <>
                            {this.state.submitted && !this.state.last_name &&
                                <Text> *Surname required</Text>
                            }
                        </>
                    </View>
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
                                <Text>Register</Text>
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
                            title="Already have an account?"
                            onPress={() => this.props.navigation.navigate('Login')}
                        />
                    </View>
                </View>
            </View>
        
    );
  }
}

export default SignUpScreen;