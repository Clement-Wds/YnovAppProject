import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import 'firebase/storage';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import config from '../../../firebase';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const LibraryScreen = () => {
  const {t} = useTranslation();

  const [artists, setArtists] = useState([]);
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

  const handleArtistPress = artist => {
    navigation.navigate('Album', {artist});
  };
  return (
    <Container>
      <Title>{t('resources.library.title')}</Title>
      {artists.map(artist => (
        <StyledTouchableOpacity
          key={artist}
          onPress={() => handleArtistPress(artist)}>
          <ArtistWrapper key={artist}>
            <Initial>{artist.charAt(0)}</Initial>
            <ArtistName>{artist}</ArtistName>
          </ArtistWrapper>
        </StyledTouchableOpacity>
      ))}
    </Container>
  );
};

const Container = styled.View`
  background-color: #121212;
  flex: 1;
  padding: 20px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  margin-bottom: 10px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ArtistName = styled.Text`
  color: #fff;
  font-size: 18px;
  margin-bottom: 10px;
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

const ArtistWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: #282828;
  padding-bottom: 10px;
`;

export default LibraryScreen;
