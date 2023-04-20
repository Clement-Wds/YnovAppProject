import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {profileDetailsRequest} from '../../actions/profile';

import styled from 'styled-components/native';
import {getAuth, signOut} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';

const LogoutScreen = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);

  const navigation = useNavigation();

  useEffect(() => {
    signOut(auth)
      .then(() => {
        dispatch(profileDetailsRequest(null));
        navigation.navigate('Home');
      })
      .catch(error => {
        Alert.alert(error);
      });
  }, []);

  return <Container></Container>;
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

export default LogoutScreen;
