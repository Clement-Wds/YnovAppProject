import React from 'react';
import styled from 'styled-components';
import {FileInput, FileField} from 'react-admin';

const Index = ({placeholder, value, onChangeText}) => {
  return (
    <>
      <InputContainer>
        <TextInputStyled
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </InputContainer>
    </>
  );
};

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const TextInputStyled = styled.TextInput`
  padding: 15px;
  font-size: 18px;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
export default Index;
