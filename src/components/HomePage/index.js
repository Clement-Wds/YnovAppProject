import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import 'firebase/storage';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import config from '../../../firebase';
import {useNavigation} from '@react-navigation/native';

//ad mob
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const HomeScreen = () => {
  const [artists, setArtists] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [allArtists, setAllArtists] = useState([]);

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
        Alert.alert('error', error);
      });
  }, []);

  useEffect(() => {
    const albumsRef = ref(db, 'artist');

    get(albumsRef)
      .then(snapshot => {
        const albumPromises = [];
        snapshot.forEach(childSnapshot => {
          const artistAlbums = childSnapshot.val();
          Object.keys(artistAlbums).forEach(albumKey => {
            const albumRef = ref(db, `artist/${childSnapshot.key}/${albumKey}`);
            const albumPromise = get(albumRef).then(albumSnapshot => {
              const albumData = albumSnapshot.val();
              const albumName = albumData.name || albumKey;
              const albumPhotoRef = firebase
                .storage()
                .ref(`audio/artiste/${childSnapshot.key}/${albumName}/photo`);

              return albumPhotoRef
                .list()
                .then(res => {
                  if (res.items.length === 0) {
                    Alert.alert(`No photo found for album ${albumName}`);
                    return {name: albumName, photo: null};
                  }
                  return res.items[0].getDownloadURL().then(url => {
                    return {name: albumName, photo: url};
                  });
                })
                .catch(error => {
                  Alert.alert(
                    'error',
                    `Error getting download URL for album ${albumName}: `,
                  );
                  return {name: albumName, photo: null};
                });
            });
            albumPromises.push(albumPromise);
          });
        });
        Promise.all(albumPromises).then(albums => {
          setAllAlbums(albums.filter(album => album.photo !== null));
        });
      })
      .catch(error => {
        Alert.alert('error', `Error getting albums: ${error}`);
      });
  }, []);
  console.log(allAlbums);

  useEffect(() => {
    const artistsRef = ref(db, 'artist');

    get(artistsRef)
      .then(snapshot => {
        const artistPromises = [];
        snapshot.forEach(childSnapshot => {
          const artistRef = ref(db, `artist/${childSnapshot.key}`);
          const artistPromise = get(artistRef).then(artistSnapshot => {
            const artistData = artistSnapshot.val();
            const artistName = artistData.name;
            const artistPhotoRef = firebase
              .storage()
              .ref(`audio/artiste/${childSnapshot.key}/photo`);
            return artistPhotoRef
              .list()
              .then(res => {
                if (res.items.length === 0) {
                  Alert.alert(
                    'error',
                    `No photo found for artist ${artistName}`,
                  );
                  return {name: childSnapshot.key, photo: null};
                }
                return res.items[0].getDownloadURL().then(url => {
                  return {name: childSnapshot.key, photo: url};
                });
              })
              .catch(error => {
                Alert.alert(
                  'error',
                  `Error getting download URL for artist ${childSnapshot.key}: `,
                );
                return {name: childSnapshot.key, photo: null};
              });
          });
          artistPromises.push(artistPromise);
        });
        Promise.all(artistPromises).then(artists => {
          setAllArtists(artists.filter(artist => artist.photo !== null));
        });
      })
      .catch(error => {
        Alert.alert('error', `Error getting artists: ${error}`);
      });
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
          {allArtists.map(artist => (
            <StyledTouchableOpacity
              key={artist.name}
              onPress={() => handleArtistPress(artist.name)}>
              <PlaylistItem key={artist.name}>
                <CoverImage source={{uri: artist.photo}} />
                <PlaylistName>{artist.name}</PlaylistName>
              </PlaylistItem>
            </StyledTouchableOpacity>
          ))}
        </ArtistList>
      </ArtistContainer>

      <SectionTitle>
        <Title>{t('resources.home.albums')}</Title>
      </SectionTitle>
      <ArtistList horizontal>
        {allAlbums.map(album => (
          <StyledTouchableOpacity key={album.name}>
            <AlbumItem key={album.name}>
              <CoverImage source={{uri: album.photo}} />
              <SongTitle>{album.name}</SongTitle>
            </AlbumItem>
          </StyledTouchableOpacity>
        ))}
      </ArtistList>

      <GAMBannerAd
        unitId={TestIds.BANNER}
        sizes={[BannerAdSize.FULL_BANNER]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </ContainerScrollView>
  );
};

const StyledTouchableOpacity = styled.TouchableOpacity``;

const AlbumItem = styled.View`
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
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

export default HomeScreen;
