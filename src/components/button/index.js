import React from 'react';
import styled from 'styled-components';

const Index = ({title, onPress}) => {
  return (
    <>
      <StyledButton onPress={onPress}>
        <StyledText>{title}</StyledText>
      </StyledButton>
    </>
  );
};
const StyledText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #0d6efd;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
  width: 100%;
`;
export default Index;
