import HomeScreen from '../components/HomePage';
import Input from '../components/textInput';
import styled from 'styled-components';
import config from '../../firebase';
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import {GoogleSignin, statusCodes, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import Button from '../components/button';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';


const Register = () => {
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
      const HandleRegister = () => {
        if (inputs.password == inputs.password_confirmation) {
          createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
            .then(userCredential => {
              // Signed in
              const user = userCredential.user;
             
              return userCredential.user.getIdToken();
              // ...
            })
            .then(accessToken => {
              AsyncStorage.setItem('token', accessToken);
              
            })
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
          .then(({ idToken, accessToken }) => {
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
            return firebase.auth().signInWithCredential(googleCredential)
              .then(({ user }) => {
                const { uid, displayName, email, photoURL } = user;
                firebase.firestore().collection('users').doc(uid).set({
                  displayName,
                  email,
                  photoURL,
                }, { merge: true });
                
                return AsyncStorage.setItem('token', idToken);
              })
              .then(() => {
                
                Alert.alert('Success', 'Your account was created successfully!');
              })
              .catch((error) => {
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
          .catch((error) => {
            console.log(error);
          });
      };

  return (
  <Container>
        <Input
                placeholder="Email"
                value={inputs.email}
                onChangeText={text => setInputs({...inputs, email: text})}
            />
            <Input
                placeholder="Password"
                value={inputs.password}
                onChangeText={text => setInputs({...inputs, password: text})}
            />
            <Input
                placeholder="Password Confirmation"
                value={inputs.password_confirmation}
                onChangeText={text =>
                setInputs({...inputs, password_confirmation: text})
                }
            />
            <Button
        title="REGISTER"
        
        onPress={HandleRegister}
        
      />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={createUserWithGoogle}
      />
      </Container>
  )
  
};
const Container = styled.View`
  flex: 1;
  padding-top: 50px;
  padding-horizontal: 20px;
`;

export default Register;
