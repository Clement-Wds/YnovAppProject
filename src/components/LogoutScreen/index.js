import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {profileDetailsRequest} from "../../actions/profile";

import styled from 'styled-components/native';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';

//Get the user's profile information from Firebase
import { compose } from 'redux';


const LogoutScreen = () => {
    const auth = getAuth();
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);

  const navigation = useNavigation();


 
  useEffect(() => {
    signOut(auth).then(() => {
        dispatch(profileDetailsRequest(null));
      navigation.navigate('Home');
    }).catch((error) => {
      console.log(error);
    });
  }, []);
    



  


 

  return (
    <Container>
      
      
      
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

export default LogoutScreen;
