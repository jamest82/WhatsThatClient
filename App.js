import LoginScreen from './Components/LoginScreen';
import SignUpScreen from './Components/SignUpScreen';
import MainAppAuthScreen from './Components/MainAppAuthScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainApp" component={MainAppAuthScreen} />
      </Stack.Navigator>
      </NavigationContainer>
  );
};