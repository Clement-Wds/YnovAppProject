import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../firebase';
import {Alert,Text} from 'react-native';
import '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import Button from '../../components/button';
import {useTranslation} from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import {ref, getDatabase,get} from 'firebase/database';

import { useSelector, useDispatch } from 'react-redux';
import {profileDetailsRequest} from "../../actions/profile";

import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const {t} = useTranslation();
  GoogleSignin.configure({
    webClientId:
      '395678982785-gmjfppo8ujm5f34i0ene0ivo6rh26k59.apps.googleusercontent.com',
    offlineAccess: false,
  });
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [isSelected, setSelection] = useState(false);


  const handleLogin = () => {
    signInWithEmailAndPassword(auth, inputs.email, inputs.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;

        return userCredential.user.getIdToken();
        // ...
      })
      .then(accessToken => {
        //AsyncStorage.setItem('token', accessToken);
        //navigation.navigate('Home');
        console.log('good' && accessToken);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/user-not-found') {
          Alert.alert('Error', 'User not found, check email and try again', [
            {text: 'OK'},
          ]);
        } else if (errorCode === 'auth/wrong-password') {
          Alert.alert('Error', 'Wrong password, check password and try again', [
            {text: 'OK'},
          ]);
        } else if (errorCode === 'auth/invalid-email') {
          Alert.alert(
            'Error',
            'Invalid email address, check email and try again',
            [{text: 'OK'}],
          );
        } else {
          console.log(errorMessage);
        }
      });
  };

  const loginUserWithGoogle = () => {
    let idToken; // Déclarer une variable pour stocker idToken

    

    GoogleSignin.signIn()
    .then(({idToken: token, accessToken}) => {
      // Stocker le token dans la variable
      idToken = token; // Affecter la valeur du token à la variable idToken
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      return firebase.auth().signInWithCredential(googleCredential);
    })
    .then(({user}) => {
      console.log(user);
  
      const {uid, displayName, email, photoURL} = user;
  
  
      // Récupérer les informations de l'utilisateur à partir de la base de données en temps réel de Firebase
      return get(ref(db, `users/${uid}`));
    })
    .then((snapshot) => {
      const user = snapshot.val();
      console.log(user);
  
      // Dispatch l'action pour mettre à jour les détails de profil de l'utilisateur
      dispatch(profileDetailsRequest(user));
  
      return console.log(idToken); //AsyncStorage.setItem('token', idToken); // Stocker idToken dans AsyncStorage
    })
    .then(() => {
      //navigation.navigate('Home')
  
      Alert.alert('Success', 'You have successfully signed in!');
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
  };

  return (
    <Container>
      <ContainerView>
        <InputTitle>{t('resources.login.email')}</InputTitle>
        <Input
          placeholder={t('resources.login.email')}
          value={inputs.email}
          onChangeText={text => setInputs({...inputs, email: text})}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <InputTitle>{t('resources.login.password')}</InputTitle>
        <Input
          placeholder={t('resources.login.password')}
          value={inputs.password}
          secureTextEntry={isSelected ? false : true}
          onChangeText={text => setInputs({...inputs, password: text})}
        />
      <Text>Show PassWord?</Text>
      <CheckBox
        disabled={false}
        value={isSelected}
        onValueChange={newValue => setSelection(newValue)}
      />
        <Button title={t('resources.login.title')} onPress={handleLogin} />
        <Button title="Se connecter avec Google" onPress={loginUserWithGoogle} />
        {/* <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={loginUserWithGoogle}
        /> */}

        <RegisterLink onPress={() => navigation.navigate('Register')}>
          <RegisterText>{t('resources.login.alreadyHaveAccount')}</RegisterText>
        </RegisterLink>

        <RegisterLink onPress={() => navigation.navigate('ForgotPassword')}>
          <RegisterText>Forgot Password ?</RegisterText>
        </RegisterLink>
      </ContainerView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
const ContainerView = styled.View`
  width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.TextInput`
  height: 50px;
  border: 1px solid #aaa;
  border-radius: 10px;
  padding: 0 20px;
  margin-bottom: 20px;
`;
const InputTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const RegisterLink = styled.TouchableOpacity`
  margin-top: 20px;
  justify-content: center;
`;

const RegisterText = styled.Text`
  color: #2f80ed;
  font-size: 16px;
`;

export default LoginScreen;
