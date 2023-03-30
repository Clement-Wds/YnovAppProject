import React, {useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

const SearchScreen = () => {
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = text => {
    setSearchText(text);
  };
  return (
    <Container>
      <SearchContainer>
        <Logo source={require('../../assets/search.png')} />
        <SearchInput
          placeholder={t('resources.search.placeholder')}
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </SearchContainer>
      <SubTitle>{t('resources.search.seeAll')}</SubTitle>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.dark};
  padding: 16px;
`;
const Logo = styled.Image`
  width: 21px;
  height: 21px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding: 4px 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.main};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${props => props.theme.text.dark};
`;

const Title = styled.Text`
  font-size: ${props => props.theme.fontSizes.mediumLarge};
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.theme.text.main};

  text-align: left;
`;
const SubTitle = styled.Text`
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.theme.text.main};
`;
export default SearchScreen;
