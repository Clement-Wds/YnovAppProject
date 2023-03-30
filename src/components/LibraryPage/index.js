import React from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

const LibraryScreen = () => {
  const {t} = useTranslation();
  return (
    <Container>
      <Title>{t('resources.library.title')}</Title>
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
  text-align: left;
`;

export default LibraryScreen;
