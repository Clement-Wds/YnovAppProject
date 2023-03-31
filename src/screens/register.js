import styled from 'styled-components';
import config from '../../firebase';
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import {GoogleSignin, statusCodes, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import { getDatabase, ref, set } from "firebase/database";
import 'firebase/auth';
import 'firebase/firestore';

import HomeScreen from '../components/HomePage';
import TextInput from '../components/textInput';
import Button from '../components/button';



const Register = () => {
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
              
            // }) -> OLD CODE CLEM
            .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
            });
        } else {
          console.log('Les mots de passes ne correspondent pas ');
        }
      };

      //REGISTER BY GOOGLE -> With store in Firebase DB
      const createUserWithGoogle = () => {

        // try{
        //   //Register avec Google
        //   const {idToken, accessToken} = await GoogleSignin.signIn();
        //   const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);

        //   //Connexion à Firebase avec les informations provenant de Google
        //   const {user} = await firebase.auth().signInWithCredential(googleCredential);
        //   //Récupération des informations de l'utilisateur
        //   const {uid, displayName, email, photoURL} = user;

        //   //Enregistrement des informations dans la base de données firebase
        //   const db = firebase.firestore();
        //   const userRef = db.collection('users').doc(uid);
        //   const userData = {
        //     displayName,
        //     email,
        //     photoURL,
        //     //others
        //   };

        //   await userRef.set(userData, {merge: true});

        //   console.log(idToken);//AsyncStorage.setItem('token', idToken);
        //   Alert.alert('Success', 'Your account was created successfully!');

        // } catch (error) {
        //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //     Alert.alert('Cancelled', 'Sign-in was cancelled!');
        //   } else if (error.code === statusCodes.IN_PROGRESS) {
        //     Alert.alert('Error', 'Another sign-in is in progress!');
        //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //     Alert.alert('Error', 'Google Play services not available!');
        //   } else {
        //     Alert.alert('Error', 'Something went wrong!' + error);
        //   }
        //   console.log(error);
        // }

        //OLD CODE BY CLEM D :

        GoogleSignin.signIn()
          .then(({ idToken, accessToken }) => {
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
            return firebase.auth().signInWithCredential(googleCredential)
              .then(({ user }) => {
                const { uid, displayName, email, photoURL } = user;

                const db = firebase.firestore();
                const userRef = db.collection('users').doc(uid);
                const userData = {
                  displayName,
                  email,
                  photoURL,
                  //others
                };

                userRef.set(userData, {merge: true});

                // firebase.firestore().collection('users').doc(uid).set({
                //   displayName,
                //   email,
                //   photoURL,
                // }, { merge: true });
                
                return console.log(idToken)//AsyncStorage.setItem('token', idToken);
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
        <TextInput
                placeholder="Email"
                value={inputs.email}
                onChangeText={text => setInputs({...inputs, email: text})}
            />
            <TextInput
                placeholder="Password"
                value={inputs.password}
                onChangeText={text => setInputs({...inputs, password: text})}
            />
            <TextInput
                placeholder="Password Confirmation"
                value={inputs.password_confirmation}
                onChangeText={text =>
                setInputs({...inputs, password_confirmation: text})
                }
            />
            <Button
        title="REGISTER"
        
        onPress={HandleRegister}
        
      /><Button
        title="Go To Login"
      
        onPress={() => navigation.navigate('Login')}
      
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
