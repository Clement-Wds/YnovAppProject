import React from 'react';
import styled from 'styled-components';

const HomeScreen = () => {
  return (
    <Container>
      <Title>Les recettes du jour</Title>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 16px;
`;
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-transform: uppercase;

  align-self: center;
`;

export default HomeScreen;
