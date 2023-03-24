import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Footer = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoriteNumber, setFavoriteNumber] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const getFavoriteRecipes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('favorites');
        if (jsonValue != null) {
          setFavoriteRecipes(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };

    getFavoriteRecipes();
  }, []);

  useEffect(() => {
    setFavoriteNumber(favoriteRecipes.length);
  }, [favoriteRecipes]);

  useEffect(() => {
    const updateFavoriteRecipes = async () => {
      try {
        await AsyncStorage.setItem(
          'favorites',
          JSON.stringify(favoriteRecipes),
        );
      } catch (e) {
        console.error(e);
      }
    };

    updateFavoriteRecipes();
  }, [favoriteRecipes]);

  return (
    <FooterContainer>
      <HomeButton onPress={() => navigation.navigate('Home')}>
        <Logo source={require('../../assets/home-icon.png')} />
        <Title>Home</Title>
      </HomeButton>
      <SearchButton>
        <Logo source={require('../../assets/search-icon.png')} />
        <Title>Search</Title>
      </SearchButton>

      <ProfilButton onPress={() => navigation.navigate('Profil')}>
        <Logo source={require('../../assets/profil-icon.png')} />
        <Title>Your Library</Title>
      </ProfilButton>
    </FooterContainer>
  );
};

const Title = styled.Text`
  font-size: 16px;
  color: #fff;

  margin-left: 8px;
`;
const SearchButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;
const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;

const FooterContainer = styled.View`
  background-color: #ff6f61;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.25);
`;

const ProfilButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;
const HomeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;

const FavoriteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;

const Logo = styled.Image`
  width: 24px;
  height: 24px;
  align-self: center;
`;

export default Footer;
