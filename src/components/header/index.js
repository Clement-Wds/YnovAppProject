import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const Header = () => {
  return (
    <Container>
      <LeftContainer>
        <Greeting>Bonjour</Greeting>
      </LeftContainer>
      <RightContainer>
        <TouchableOpacity>
          <Logo source={require('../../assets/history.png')} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Logo source={require('../../assets/settings.png')} />
        </TouchableOpacity>
      </RightContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${props => props.theme.colors.main};

  elevation: 5;
  z-index: 1;
  width: 100%;
`;

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`;
const LeftContainer = styled.View`
  flex: 1;
`;

const RightContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80px;
`;

const Greeting = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
  color: ${props => props.theme.text.dark};
`;

export default Header;
