import TextInput from '../../components/textInput';
import styled from 'styled-components';
import config from '../../../firebase';
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Button from '../../components/button';
import React, {useEffect, useState} from 'react';

import {Alert, PermissionsAndroid, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {getDatabase, ref, set, get} from 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
//import Geolocation from '@react-native-community/geolocation'; pour avoir la locatio exact
import * as RNLocalize from 'react-native-localize';
import CheckBox from '@react-native-community/checkbox';

import {requestMultiple} from 'react-native-permissions';

const RegisterPage = () => {
  const requestPermissions = async () => {
    const result = await requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  };
  useEffect(() => {
    requestPermissions();
  }, []);

  const {t} = useTranslation();
  const navigation = useNavigation();
  GoogleSignin.configure({
    webClientId:
      '395678982785-gmjfppo8ujm5f34i0ene0ivo6rh26k59.apps.googleusercontent.com',
    offlineAccess: false,
  });
  const [isSelected, setSelection] = useState(false);
  const [isSelected2, setSelection2] = useState(false);

  const app = initializeApp(config);
  const auth = getAuth(app);
  const [inputs, setInputs] = React.useState({
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [positionGPS, setPositionGPS] = React.useState({
    longitude: '',
    latitude: '',
  });
  const [codePays, setCodePays] = useState('');

  const GetPosition = async () => {
    try {
      await requestPermissions();
      setCodePays(RNLocalize.getCountry());
    } catch (err) {
      Alert.alert('error', `Error selecting audio file: ${err}`);
    }
  };

  const HandleRegister = () => {
    if (inputs.password == inputs.password_confirmation) {
      createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
        .then(userCredential => {
          // Signed in
          const user = userCredential.user;
          const db = getDatabase();
          GetPosition();
          const userRef = ref(db, 'users/' + user.uid);

          // Enregistrer les informations de l'utilisateur dans la base de données
          const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            pays: user.codePays,
            uid: user.uid,
            //others
          };

          return set(userRef, userData);
        })
        .then(() => {
          Alert.alert('success', 'Utilisateur enregistré avec succès.');
        })
        .catch(error => {
          Alert.alert('error', error);
        });
    } else {
      Alert.alert('error', 'Les mots de passes ne correspondent pas');
    }
  };

  const createUserWithGoogle = () => {
    GoogleSignin.signIn()
      .then(({idToken, accessToken}) => {
        const googleCredential =
          firebase.auth.GoogleAuthProvider.credential(idToken);
        return firebase
          .auth()
          .signInWithCredential(googleCredential)
          .then(({user}) => {
            const {uid, displayName, email, photoURL} = user;
            const db = getDatabase();
            const userRef = ref(db, 'users/' + uid);
            const userData = {
              displayName,
              email,
              photoURL,
              pays: codePays,
              uid: uid,
            };
            return get(userRef).then(snapshot => {
              if (snapshot.exists()) {
                // L'utilisateur existe déjà dans la base de données
                const existingData = snapshot.val();
                const mergedData = {
                  ...existingData,
                  ...userData,
                };
                // Mettre à jour les informations existantes avec les nouvelles données fusionnées
                return set(userRef, mergedData).then(() => {
                  Alert.alert('success', 'Utilisateur fusionné avec succès.');
                });
              } else {
                // L'utilisateur n'existe pas encore dans la base de données
                return set(userRef, userData).then(() => {
                  Alert.alert('success', 'Utilisateur enregistré avec succès');
                });
              }
            });
          })
          .then(() => {
            Alert.alert('Success', 'Your account was created successfully!');
          })
          .catch(error => {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              Alert.alert('Cancelled', 'Sign-in was cancelled!');
            } else if (error.code === statusCodes.IN_PROGRESS) {
              Alert.alert('Error', 'Another sign-in is in progress!');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              Alert.alert('Error', 'Google Play services not available!');
            } else {
              Alert.alert('Error', 'Something went wrong!' + error);
            }
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Title>{t('resources.register.title')}</Title>
      <TextInput
        placeholder={t('resources.register.email')}
        value={inputs.email}
        onChangeText={text => setInputs({...inputs, email: text})}
      />
      <TextInput
        placeholder={t('resources.register.password')}
        value={inputs.password}
        //hide password
        secureTextEntry={isSelected ? false : true}
        onChangeText={text => setInputs({...inputs, password: text})}
      />
      <Text>{t('resources.register.showPassword')}</Text>
      <CheckBox
        disabled={false}
        value={isSelected}
        onValueChange={newValue => setSelection(newValue)}
      />
      <TextInput
        placeholder={t('resources.register.passwordConfirm')}
        value={inputs.password_confirmation}
        //hide password
        secureTextEntry={isSelected2 ? false : true}
        onChangeText={text =>
          setInputs({...inputs, password_confirmation: text})
        }
      />
      <Text>{t('resources.register.showPasswordConfirmation')}</Text>
      <CheckBox
        disabled={false}
        value={isSelected2}
        onValueChange={newValue => setSelection2(newValue)}
      />
      <Button title={t('resources.register.title')} onPress={HandleRegister} />

      <Button
        title={t('resources.register.google')}
        onPress={createUserWithGoogle}
      />
      <RegisterLink onPress={() => navigation.navigate('Login')}>
        <RegisterText>
          {t('resources.register.alreadyHaveAccount')}
        </RegisterText>
      </RegisterLink>
    </Container>
  );
};
const Container = styled.View`
  flex: 1;
  padding: 20px;
`;
const RegisterLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const RegisterText = styled.Text`
  color: #2f80ed;
  font-size: 16px;
`;
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export default RegisterPage;
