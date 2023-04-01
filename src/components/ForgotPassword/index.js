import React, {useState} from 'react';
import styled from 'styled-components/native';
import Button from '../../components/button';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../../firebase';
import {firebase} from '@react-native-firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const app = initializeApp(firebaseConfig);
    const handleResetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email)
          .then(() => {
            console.log('Password reset email sent successfully');
          })
          .catch((error) => {
            console.log('Error sending password reset email: ', error);
          });
      };

  return (
    <Container>
      <ContainerView>
        <InputTitle>Reset Password</InputTitle>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
        />
      
     
      
        <Button title="Reset Password" onPress={handleResetPassword} />

       
      </ContainerView>
    </Container>
   
  );
};


export default ForgotPassword;


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


