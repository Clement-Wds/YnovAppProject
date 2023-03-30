import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Footer = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <FooterContainer>
      <HomeButton onPress={() => navigation.navigate('Home')}>
        <Logo source={require('../../assets/home.png')} />
        <Title>{t('resources.footer.home')}</Title>
      </HomeButton>
      <SearchButton onPress={() => navigation.navigate('Search')}>
        <Logo source={require('../../assets/search.png')} />
        <Title>{t('resources.footer.search')}</Title>
      </SearchButton>
      <SearchButton onPress={() => navigation.navigate('Register')}>
        <Logo source={require('../../assets/user.png')} />
        <Title>{t('resources.footer.register')}</Title>
      </SearchButton>
      <LibraryButton onPress={() => navigation.navigate('Library')}>
        <Logo source={require('../../assets/library.png')} />
        <Title>{t('resources.footer.library')}</Title>
      </LibraryButton>
      <LibraryButton onPress={() => navigation.navigate('AddMusique')}>
        <Logo source={require('../../assets/plus-circle.png')} />
        <Title>{t('resources.footer.add')}</Title>
      </LibraryButton>
    </FooterContainer>
  );
};

const Title = styled.Text`
  font-size: ${props => props.theme.fontSizes.medium};
  font-family: ${props => props.theme.fonts.regular};
  color: ${props => props.theme.text.dark};
  margin-top: 4px;
`;
const SearchButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;
const LibraryButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`;

const FooterContainer = styled.View`
  background-color: ${props => props.theme.colors.main};
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.25);
`;

const HomeButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
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
