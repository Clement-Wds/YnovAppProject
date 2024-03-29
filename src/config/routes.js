import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import * as React from 'react';
import {useEffect, useState} from 'react';
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
import Logout from '../screens/logout';
import TrackList from '../screens/TrackListScreen';

import {useSelector, useDispatch} from 'react-redux';
import {profileDetailsRequest} from '../../src/actions/profile';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="TrasckList" component={TrackList} />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const {t} = useTranslation();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        //UTILISATION DE REDUX pour afficher l'utilisateur
        dispatch(profileDetailsRequest(user));

        //setUser(user);
        AsyncStorage.getItem('token').then(token => {
          setToken(token);
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [user]);

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
        component={TrackList}
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
      {profileState?.isAdmin ? (
        <Tab.Screen
          name={t('resources.addMusic.title')}
          component={AddMusique}
          options={{
            tabBarIcon: () => (
              <Logo source={require('../assets/plus-circle.png')} />
            ),
          }}
        />
      ) : null}

      {!profileState?.email ? (
        <Tab.Screen
          name={t('resources.register.title')}
          component={Register}
          options={{
            tabBarIcon: () => <Logo source={require('../assets/log-in.png')} />,
          }}
        />
      ) : (
        <Tab.Screen
          name={t('resources.logout.title')}
          component={Logout}
          options={{
            tabBarIcon: () => <Logo source={require('../assets/logout.png')} />,
          }}
        />
      )}
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
