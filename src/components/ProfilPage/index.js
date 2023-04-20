import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {profileDetailsRequest} from '../../actions/profile';

import styled from 'styled-components/native';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

//Get the user's profile information from Firebase
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {useTranslation} from 'react-i18next';

const ProfileScreen = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);
  console.log('STATE : ' + profileState);

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
    <Container>
      <ProfileInfo>
        <ProfileImage src={profileState?.photoURL} />
        <ProfileName>
          {t('resources.profil.hello')} {profileState?.displayName}
        </ProfileName>
        <ProfileText>
          {t('resources.profil.displayName')} {profileState?.displayName}
        </ProfileText>
        <ProfileText>
          {t('resources.profil.email')} {profileState?.email}
        </ProfileText>
        <ProfileText>
          {t('resources.profil.state')} {profileState?.pays}
        </ProfileText>
        <ProfileText>IsAdmin :</ProfileText>
        <CheckBox disabled={false} value={profileState?.isAdmin} />
      </ProfileInfo>
    </Container>
  );
};

export default ProfileScreen;
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.dark};
`;

const ProfileInfo = styled.View`
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const ProfileName = styled.Text`
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.text.main};
  margin-bottom: 8px;
`;

const ProfileText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text.lightGrey};
`;
