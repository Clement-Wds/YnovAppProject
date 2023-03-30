import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {AntDesign} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import firebase from '../../../firebase';

const HomeScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistsRef = firebase.firestore().collection('playlists');
      const snapshot = await playlistsRef.get();
      const playlistsData = snapshot.docs.map(doc => doc.data());
      setPlaylists(playlistsData);
    };
    fetchPlaylists();
  }, []);

  const {t} = useTranslation();

  const RecentlyPlayed = [
    {
      id: 1,
      title: 'Song Title 1',
      artist: 'Artist Name 1',
      image: 'https://picsum.photos/id/876/200/200',
    },
    {
      id: 2,
      title: 'Song Title 2',
      artist: 'Artist Name 2',
      image: 'https://picsum.photos/id/877/200/200',
    },
    {
      id: 3,
      title: 'Song Title 3',
      artist: 'Artist Name 3',
      image: 'https://picsum.photos/id/878/200/200',
    },
    {
      id: 4,
      title: 'Song Title 4',
      artist: 'Artist Name 4',
      image: 'https://picsum.photos/id/879/200/200',
    },
  ];

  return (
    <ContainerScrollView>
      <MainTitle>
        <AntDesign name="user" size={24} color="white" />
      </MainTitle>
      <SectionTitle>
        <MaterialIcons name="history" size={24} color="white" />
        <Title>{t('resources.home.recentlyPlayed')}</Title>
      </SectionTitle>
      <RecentlyPlayedContainer horizontal>
        {RecentlyPlayed.map(item => (
          <RecentlyPlayedItem key={item.id}>
            <CoverImage source={{uri: item.image}} />
            <SongTitle>{item.title}</SongTitle>
            <ArtistName>{item.artist}</ArtistName>
          </RecentlyPlayedItem>
        ))}
      </RecentlyPlayedContainer>

      <SectionTitle>
        <MaterialIcons name="playlist-play" size={24} color="white" />
        <Title>{t('resources.home.playlists')}</Title>
      </SectionTitle>
      <PlaylistContainer>
        <PlaylistList horizontal>
          {playlists.map(playlist => (
            <PlaylistImage key={playlist.id} source={{uri: playlist.image}} />
          ))}
        </PlaylistList>
      </PlaylistContainer>

      <SectionTitle>
        <MaterialIcons name="album" size={24} color="white" />
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
