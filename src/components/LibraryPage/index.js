import React from 'react';
import styled from 'styled-components';

const LibraryScreen = () => {
  return (
    <Container>
      <Title>Bibliothèque</Title>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.dark};

  padding: 16px;
`;
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;

  color: ${props => props.theme.text.main};
  text-transform: uppercase;

  align-self: center;
`;

export default LibraryScreen;
