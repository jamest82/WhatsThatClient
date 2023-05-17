/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Button, Text, View, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, TextInput
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
        <View style={styles.container}>
          <Text> Search </Text>
          <TextInput
            onChangeText={(varQuery) => this.setState({ query: varQuery })}
            value={query}
          />
          <View style={styles.search}>
            <Text>Contacts</Text>
            <SwitchToggle
              switchOn={searchAll}
              onPress={() => this.setState({ searchAll: !searchAll }, console.log(`switched ${searchAll}`))}
            />
            <Text>All</Text>
          </View>
          <Button
            title="Search"
            onPress={() => this.checkType(() => {
              this.doSearch();
            })}
          />
          <View style={styles.spacer} />
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
              <View style={styles.contactCards}>
                <TouchableOpacity onPress={() => this.onCardPress(item.user_id)}>
                  <Text style={styles.contactName}>{`${item.given_name} ${item.family_name}`}</Text>
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

const styles = StyleSheet.create({
  container: {
    height: 800,
    backgroundColor: 'lightblue',
    justifyContent: 'center'
  },
  contactCards: {
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactName: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  spacer: {
    marginTop: 5
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
