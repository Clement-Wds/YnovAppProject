import React from 'react';
import styled from 'styled-components';
import ShowAudio from '../ShowAudio';

const HomeScreen = () => {
  return (
    <Container>
      <Title>SpotYnov</Title>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.dark};
  font-family: ${props => props.theme.fonts.regular};

  padding: 16px;
`;
const Title = styled.Text`
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: bold;
  margin-bottom: 16px;

  color: ${props => props.theme.text.main};
  text-transform: uppercase;

  align-self: center;
`;

export default HomeScreen;
