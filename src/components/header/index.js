import React, {useState, useEffect} from 'react';
import {
  Image,
  TouchableOpacity,
  useFocusEffect,
  View,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';

const Header = ({title}) => {
  const navigation = useNavigation();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [token, setToken] = useState(null);

  const handleMenuPress = () => {
    setMenuOpen(!menuOpen);
  };

  //Vérifier si le token est toujours valide

  const handleNavigate = screen => {
    navigation.navigate(screen);
    setMenuOpen(false);
  };

  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <BackButton source={require('../../assets/back-arrow.png')} />
      </TouchableOpacity>
      <LogoTouchable onPress={() => navigation.navigate('Home')}>
        <Logo
          source={require('../../assets/logo.png')}
          resizeMode="contain"></Logo>
      </LogoTouchable>
      {menuOpen && (
        <MenuContainer>
          <MenuOption onPress={() => handleNavigate('Home')}>
            <MenuText>Toute nos recettes</MenuText>
          </MenuOption>
          <MenuOption onPress={() => handleNavigate('Home')}>
            <MenuText>Ajouter une recette</MenuText>
          </MenuOption>
        </MenuContainer>
      )}
      <TouchableOpacity onPress={() => handleMenuPress()}>
        <HamburgerMenu source={require('../../assets/menu-icon.png')} />
      </TouchableOpacity>
    </Container>
  );
};

const Logo = styled.Image`
  width: 100px;
  height: 100px;
`;

const LogoTouchable = styled.TouchableOpacity`
  flex 1;
 
`;
const HamburgerMenu = styled.Image`
  width: 40px;
  height: 40px;
  align-self: center;
`;
const MenuContainer = styled.View`
  position: absolute;
  top: 60px;
  right: 0;
  width: 150px;
  border-radius: 10px;
  background-color: #ffffff;
  shadow-color: #000000;
  shadow-offset: {
    width: 0,
    height: 2,
  };
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
  z-index: 1;
`;
const MenuOption = styled.TouchableOpacity`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #dddddd;
`;
const MenuText = styled.Text`
  font-size: 18px;
`;
const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  shadow-color: #000000;
  shadow-offset: {
    width: 0,
    height: 2,
  };
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
  z-index: 1;
  width: 100%;
  
`;

const BackButton = styled.Image`
  width: 24px;
  height: 24px;
  align-self: center;
`;

export default Header;
