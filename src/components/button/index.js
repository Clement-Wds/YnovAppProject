import React from 'react';
import styled from 'styled-components';

const Index = ({title, onPress}) => {
  return (
    <>
      <StyledButton onPress={onPress}>
        <StyledButtonText>{title}</StyledButtonText>
      </StyledButton>
    </>
  );
};
const StyledButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.dark};
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
  justify-content: center;
  width: 100%;
`;

const StyledButtonText = styled.Text`
  color: ${props => props.theme.text.white};
  font-size: 18px;
  font-weight: bold;
`;
export default Index;
