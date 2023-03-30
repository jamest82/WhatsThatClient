/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, FlatList, TouchableOpacity, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchToggle from 'react-native-switch-toggle';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      contactsData: [],
      query: '',
      searchType: 'all',
      offset: 0,
      limit: 5,
      searchAll: true
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  onCardPress = async (id) => {
    const { navigation } = this.props;
    console.log(`Touched ${id}`);
    await AsyncStorage.setItem('whatsthat_contact_id', id);
    navigation.navigate('ContactProfile');
  };

  nextPage = async (done) => {
    const { offset } = this.state;
    this.setState({
      offset: offset + 5
    }, () => {
      done();
    });
    console.log(offset);
    this.doSearch();
  };

  prevPage = async (done) => {
    const { offset } = this.state;
    this.setState({
      offset: offset - 5
    }, () => {
      done();
    });
    console.log(offset);
    this.doSearch();
  };

  checkType = async (done) => {
    const { searchAll } = this.state;
    if (!searchAll) {
      this.setState({
        searchType: 'contacts'
      }, () => {
        done();
      });
    } else {
      this.setState({
        searchType: 'all'
      }, () => {
        done();
      });
    }
  };

  doSearch = async () => {
    const {
      query, searchType, limit, offset
    } = this.state;
    this.setState({
      isLoading: true
    });
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    console.log(offset);
    console.log(searchType);
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${query}&search_in=${searchType}&limit=${limit}&offset=${offset}`,
      {
        method: 'get',
        headers: { 'X-Authorization': token }
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          contactsData: responseJson
        });
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const {
      contactsData, isLoading, query, limit, offset, searchAll
    } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <Text> Search </Text>
          <TextInput
            onChangeText={(varQuery) => this.setState({ query: varQuery })}
            value={query}
          />
          <Text> Left: contacts Right: all</Text>
          <SwitchToggle
            switchOn={searchAll}
            onPress={() => this.setState({ searchAll: !searchAll }, console.log(`switched ${searchAll}`))}
          />
          <Button
            title="Search"
            onPress={() => this.checkType(() => {
              this.doSearch();
            })}
          />
          {!(contactsData.length < limit)
            && (
            <Button
              title="Next Page"
              onPress={() => this.nextPage(() => {
                this.doSearch();
              })}
            />
            ) }
          {(offset > 1)
            && (
              <Button
                title="Prev Page"
                onPress={() => this.prevPage(() => {
                  this.doSearch();
                })}
              />
            )}
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => this.onCardPress(item.user_id)}>
                  <Text>{`${item.given_name} ${item.family_name}`}</Text>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
      );
    }
  }
}
