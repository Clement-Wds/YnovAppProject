import React from 'react';
import styled from 'styled-components/native';
import {TextInput} from 'react-native-paper';

const Index = ({placeholder, value, onChangeText, secureTextEntry}) => {
  return (
    <InputContainer>
      <TextInputStyled
        label={placeholder}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        secureTextEntry={secureTextEntry}
      />
    </InputContainer>
  );
};

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const TextInputStyled = styled(TextInput)`
  font-size: 18px;
  background-color: transparent;
  border-radius: 18px;
`;

export default Index;
