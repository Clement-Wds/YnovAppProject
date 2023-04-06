import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {initializeApp} from 'firebase/app';
import {ref, set, get, query, orderByChild, equalTo} from 'firebase/database';
import 'firebase/storage';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import config from '../../../firebase';
import {useNavigation} from '@react-navigation/native';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const HomeScreen = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const artistRef = ref(db, 'artist');
    get(artistRef)
      .then(snapshot => {
        const artists = [];
        snapshot.forEach(childSnapshot => {
          const artist = childSnapshot.key;
          artists.push(artist);
        });
        setArtists(artists);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const albumsRef = ref(db, 'artist');
    get(albumsRef)
      .then(snapshot => {
        const albums = [];
        snapshot.forEach(childSnapshot => {
          const artistAlbums = childSnapshot.val();
          Object.keys(artistAlbums).forEach(album => {
            albums.push(album);
          });
        });
        setAlbums(albums);
      })
      .catch(error => {
        console.log(error);
      });
    //Récuperer l'image de l'album
  }, []);

  const handleArtistPress = artist => {
    navigation.navigate('Album', {artist});
  };
  return (
    <ContainerScrollView>
      <MainTitle></MainTitle>

      <SectionTitle>
        <Title>{t('resources.home.artists')}</Title>
      </SectionTitle>
      <ArtistContainer>
        <ArtistList horizontal>
          {artists.map(artist => (
            <StyledTouchableOpacity
              key={artist}
              onPress={() => handleArtistPress(artist)}>
              <PlaylistItem key={artist}>
                <CoverImage
                  source={{
                    uri: 'https://th.bing.com/th/id/R.d18d3a164ae5c25af0e37c47fb9691a5?rik=llRrX6QhdCIfPA&pid=ImgRaw&r=0',
                  }}
                />

                <PlaylistName>{artist}</PlaylistName>
              </PlaylistItem>
            </StyledTouchableOpacity>
          ))}
        </ArtistList>
      </ArtistContainer>

      <SectionTitle>
        <Title>{t('resources.home.albums')}</Title>
      </SectionTitle>
      <ArtistList horizontal>
        {albums.map(album => (
          <StyledTouchableOpacity
            key={album}
            onPress={() => console.log('Album selected:', album)}>
            <AlbumItem key={album}>
              <CoverImage
                source={{
                  uri: 'https://th.bing.com/th/id/R.d18d3a164ae5c25af0e37c47fb9691a5?rik=llRrX6QhdCIfPA&pid=ImgRaw&r=0',
                }}
              />
              <SongTitle>{album}</SongTitle>
            </AlbumItem>
          </StyledTouchableOpacity>
        ))}
      </ArtistList>
    </ContainerScrollView>
  );
};
const RecentlyPlayedContainer = styled.ScrollView`
  margin-top: 16px;
`;
const StyledTouchableOpacity = styled.TouchableOpacity``;

const AlbumItem = styled.View`
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
`;
const RecentlyPlayedItem = styled.View`
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
`;
const Initial = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1db954;
  text-align: center;
  line-height: 40px;
`;
const PlaylistItem = styled.View`
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
`;

const PlaylistName = styled.Text`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.text.light};
  margin-top: 4px;
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

const ArtistContainer = styled.View`
  margin-top: 16px;
  height: 200px;
`;

const ArtistList = styled.ScrollView`
  flex-grow: 0;
`;

const ArtistIcon = styled.Image`
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
