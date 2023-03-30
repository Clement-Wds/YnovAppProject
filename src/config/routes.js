import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import * as React from 'react';
import styled from 'styled-components';
import Home from '../screens/home';
import Search from '../screens/search';
import Library from '../screens/library';
import Header from '../components/header';
import {MaterialIcons} from 'react-native-vector-icons';
import Register from '../screens/register';
import AddMusique from '../screens/addMusique';
import Profil from '../screens/profl';
import Login from '../screens/login';
import {Ionicons} from 'react-native-vector-icons';
import {FontAwesome} from 'react-native-vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={t('resources.home.title')} component={Home} />
      <Stack.Screen name={t('resources.search.title')} component={Search} />
      <Stack.Screen name={t('resources.library.title')} component={Library} />
      <Stack.Screen name={t('resources.register.title')} component={Register} />
      <Stack.Screen
        name={t('resources.addMusique.title')}
        component={AddMusique}
      />
      <Stack.Screen name={t('resources.profil.title')} component={Profil} />
      <Stack.Screen name={t('resources.login.title')} component={Login} />
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
          tabBarIcon: () => <Logo source={require('../assets/user.png')} />,
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

export default Routes;
