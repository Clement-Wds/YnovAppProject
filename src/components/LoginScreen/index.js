import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../firebase';
import {Alert} from 'react-native';
import '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  GoogleSignin.configure({
    webClientId:
      '395678982785-gmjfppo8ujm5f34i0ene0ivo6rh26k59.apps.googleusercontent.com',
    offlineAccess: false,
  });
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const navigation = useNavigation();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });



  

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
        console.log("good"&& accessToken)
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
        }else if (errorCode === 'auth/invalid-email'){
          Alert.alert('Error', 'Invalid email address, check email and try again', [
            
            {text: 'OK'},
          ]);

        } else {
          console.log(errorMessage);
        }
      });
  };


  
  const loginUserWithGoogle = () => {
    let idToken; // Déclarer une variable pour stocker idToken
    
    GoogleSignin.signIn()
      .then(({ idToken: token, accessToken }) => { // Stocker le token dans la variable
        idToken = token; // Affecter la valeur du token à la variable idToken
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
        return firebase.auth().signInWithCredential(googleCredential);
      })
      .then(({ user }) => {
        console.log(user);
        const { uid, displayName, email, photoURL } = user;
        firebase.firestore().collection('users').doc(uid).set({
          displayName,
          email,
          photoURL,
        }, { merge: true });
        
        return console.log(idToken) //AsyncStorage.setItem('token', idToken); // Stocker idToken dans AsyncStorage
      })
      .then(() => {
        
        
        //navigation.navigate('Home')
        
        Alert.alert('Success', 'You have successfully signed in!');
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
  };

  return (
    <Container>
      <ContainerView>
        <InputTitle>Adresse Email</InputTitle>
        <Input
          placeholder="Email"
          value={inputs.email}
          onChangeText={text => setInputs({...inputs, email: text})}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <InputTitle>Mot de Passe</InputTitle>
        <Input
          placeholder="Mot de passe"
          value={inputs.password}
          secureTextEntry
          onChangeText={text => setInputs({...inputs, password: text})}
        />
        <Button onPress={handleLogin}>
          <ButtonText>Connexion</ButtonText>
        </Button>

        <Button onPress={loginUserWithGoogle}>
          <ButtonText>Connexion avec Google</ButtonText>
        </Button>



        <RegisterLink onPress={() => navigation.navigate('Register')}>
          <RegisterText>
            Vous n'avez pas encore de compte ? Inscrivez vous !
          </RegisterText>
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
const BackGroundImageView = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  resize-mode: stretch;
  margin: 0;
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

const Button = styled.TouchableOpacity`
  height: 50px;
  background-color: #2f80ed;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const RegisterLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const RegisterText = styled.Text`
  color: #2f80ed;
  font-size: 16px;
`;

export default LoginScreen;
