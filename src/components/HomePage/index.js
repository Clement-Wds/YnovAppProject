import React from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

const HomeScreen = () => {
  const {t} = useTranslation();

  return (
    <ContainerScrollView>
      <MainTitle></MainTitle>
      <SectionTitle>
        <Title>{t('resources.home.recentlyPlayed')}</Title>
      </SectionTitle>
      <RecentlyPlayedContainer horizontal></RecentlyPlayedContainer>

      <SectionTitle>
        <Title>{t('resources.home.playlists')}</Title>
      </SectionTitle>
      <PlaylistContainer>
        <PlaylistList horizontal></PlaylistList>
      </PlaylistContainer>

      <SectionTitle>
        <Title>{t('resources.home.albums')}</Title>
      </SectionTitle>
      <Albums>
        <AlbumImage source={{uri: 'https://picsum.photos/id/874/300/300'}} />
        <AlbumImage source={{uri: 'https://picsum.photos/id/875/300/300'}} />
      </Albums>
    </ContainerScrollView>
  );
};
const RecentlyPlayedContainer = styled.ScrollView`
  margin-top: 16px;
`;

const RecentlyPlayedItem = styled.View`
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
`;

const CoverImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SongTitle = styled.Text`
  font-size: ${props => props.theme.fontSizes.medium};
  color: ${props => props.theme.text.main};
`;

const ArtistName = styled.Text`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.text.light};
  margin-top: 4px;
`;

const ContainerScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.colors.dark};
  padding: 16px;
`;

const MainTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: bold;
  margin-bottom: 16px;
  margin-left: 8px;

  color: ${props => props.theme.text.main};
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 32px;
`;

const PlaylistContainer = styled.View`
  margin-top: 16px;
  height: 200px;
`;

const PlaylistList = styled.ScrollView`
  flex-grow: 0;
`;

const PlaylistImage = styled.Image`
  width: 150px;
  height: 150px;
  margin-right: 16px;
`;

const Albums = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 32px;
`;
const AlbumImage = styled.Image`
  width: 150px;
  height: 150px;

  border-radius: 70px;
  border-width: 1px;
`;

export default HomeScreen;
