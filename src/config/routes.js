import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import HomeScreen from '../screens/home';
import Search from '../screens/search';
import Library from '../screens/library';
import Header from '../components/header';
import Register from '../screens/register';
import AddMusique from '../screens/addMusique';
import Profil from '../screens/profl';
import Login from '../screens/login';
import DeleteMusique from '../components/DeleteMusique';
import ForgotPassword from '../screens/forgotPassword';
import AlbumScreen from '../screens/album';
import AlbumScreenCard from '../screens/albumSong';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AddMusique" component={AddMusique} />
      <Stack.Screen name="Profil" component={Profil} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="DeleteMusique" component={DeleteMusique} />
      <Stack.Screen name="Album" component={AlbumScreen} />
      <Stack.Screen name="AlbumCard" component={AlbumScreenCard} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={t('resources.home.title')}
        component={MainStackNavigator}
        options={{
          headerShown: true,
          header: ({navigation}) => <Header navigation={navigation} />,
          tabBarIcon: () => <Logo source={require('../assets/home.png')} />,
        }}
      />
      <Tab.Screen
        name={t('resources.search.title')}
        component={Search}
        options={{
          tabBarIcon: () => <Logo source={require('../assets/search.png')} />,
        }}
      />

      <Tab.Screen
        name={t('resources.library.title')}
        component={Library}
        options={{
          tabBarIcon: () => <Logo source={require('../assets/library.png')} />,
        }}
      />

      <Tab.Screen
        name={t('resources.register.title')}
        component={Register}
        options={{
          tabBarIcon: () => <Logo source={require('../assets/log-in.png')} />,
        }}
      />
      <Tab.Screen
        name={t('resources.addMusique.title')}
        component={AddMusique}
        options={{
          tabBarIcon: () => (
            <Logo source={require('../assets/plus-circle.png')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Routes = () => {
  return (
    <GlobalSafeArea>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </GlobalSafeArea>
  );
};

const GlobalSafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: red;
`;
const Logo = styled.Image`
  width: 20px;
  height: 20px;
`;
const LoginOptionsContainer = styled.View`
  position: absolute;
  top: 60px;
  right: 10px;
  width: 120px;
  background-color: #fff;
  border-radius: 5px;
  elevation: 3;
  z-index: 1;
`;
const StyledIcon = styled.Image`
  width: 20px;
  height: 20px;
`;
const StyledTouchableOpacity = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 5px;
  elevation: 3;
  z-index: 1;
`;
const LoginOption = styled.Text`
  padding: 10px;
`;

export default Routes;
