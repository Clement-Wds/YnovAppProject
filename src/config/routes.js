import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import styled from 'styled-components';
import Home from '../screens/home';
import Search from '../screens/search';
import Library from '../screens/library';
import Header from '../components/header';
import Footer from '../components/footer';
import Register from '../screens/register'
const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <GlobalSafeArea>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: ({navigation}) => <Header navigation={navigation} />,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Library" component={Library} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
        <Footer />
      </NavigationContainer>
    </GlobalSafeArea>
  );
};

const GlobalSafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: red;
`;

export default Routes;
