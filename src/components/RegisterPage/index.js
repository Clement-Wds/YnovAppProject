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
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Button from '../../components/button';
import React,{useEffect}from 'react';

import {Alert,PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import { getDatabase, ref, set } from "firebase/database";
import 'firebase/auth';
import 'firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import {requestMultiple} from 'react-native-permissions';

const RegisterPage = () => {
  const requestPermissions = async () => {
    const result = await requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    
    ]);
    console.log(result);
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
  const app = initializeApp(config);
  const auth = getAuth(app);
  const [inputs, setInputs] = React.useState({
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [positionGPS, setPositionGPS]= React.useState({
    longitude:'',
    latitude:''
  })

  const GetPosition = async () =>{

    try {
      await requestPermissions();
      Geolocation.getCurrentPosition(
   
        (position) => {
          setPositionGPS({...positionGPS, latitude: position.coords.latitude})
          setPositionGPS({...positionGPS, longitude: position.coords.longitude})
          console.log(positionGPS.latitude);
          console.log(positionGPS.longitude);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      
      );

    }catch (err) {
      console.log('Error selecting audio file: ', err);
    }

  }
  

  const HandleRegister = () => {
    if (inputs.password == inputs.password_confirmation) {
      createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
        .then(userCredential => {
          // Signed in
          const user = userCredential.user;
          const db = getDatabase();
          const userRef = ref(db, 'users/' + user.uid);

          // Enregistrer les informations de l'utilisateur dans la base de données
          const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            //others
          };

          return set(userRef, userData);

          //return userCredential.user.getIdToken(); ->OLD CODE CLEM
          // ...
        })
        .then(() => {
          console.log('Utilisateur enregistré avec succès dans la base de données Firebase');
        })
        // .then(accessToken => {
        //   //AsyncStorage.setItem('token', accessToken);
        //   console.log(accessToken)
          
        // }) -> OLD CODE CLEM d
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    } else {
      console.log('Les mots de passes ne correspondent pas ');
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
            firebase.firestore().collection('users').doc(uid).set(
              {
                displayName,
                email,
                photoURL,
              },
              {merge: true},
            );

            return console.log(idToken); //AsyncStorage.setItem('token', idToken);
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
        secureTextEntry={true}
        onChangeText={text => setInputs({...inputs, password: text})}
      />
      <TextInput
        placeholder={t('resources.register.passwordConfirm')}
        value={inputs.password_confirmation}
        //hide password
        secureTextEntry={true}
        onChangeText={text =>
          setInputs({...inputs, password_confirmation: text})
        }
      />
      <Button title={t('resources.register.title')} onPress={HandleRegister} />
      <Button title={t('resources.register.title')} onPress={GetPosition} />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
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
