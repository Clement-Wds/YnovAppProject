import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import config from '../../../firebase';
import {useNavigation, useRoute} from '@react-navigation/native';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const AlbumScreen = () => {
  const [albums, setAlbums] = useState([]);
  const route = useRoute();
  const {artist} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const albumRef = ref(db, `artist/${artist}`);
    get(albumRef)
      .then(snapshot => {
        const albums = [];
        snapshot.forEach(childSnapshot => {
          const album = childSnapshot.key;
          albums.push(album);
        });
        setAlbums(albums);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <ArtistName>{artist}</ArtistName>

      <Header>
        <HeaderText>Albums récents</HeaderText>
      </Header>

      <AlbumList
        data={albums}
        renderItem={({item, index}) => (
          <AlbumWrapper key={index}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AlbumCard', {
                  title: item,
                  album: albums,
                })
              }>
              <AlbumTitle>{item}</AlbumTitle>
            </TouchableOpacity>
          </AlbumWrapper>
        )}
        keyExtractor={(item, index) => `${index}`}
      />
    </Container>
  );
};

const Container = styled.View`
  background-color: #121212;
  flex: 1;
  padding: 20px;
`;
const Header = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const HeaderText = styled.Text`
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
`;

const AlbumList = styled.FlatList`
  flex: 1;
  padding: 10px;
`;

const AlbumWrapper = styled.View`
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 5px;
  margin: 5px;
  padding: 10px;
`;

const AlbumTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ArtistName = styled.Text`
  color: #b3b3b3;
  font-size: 16px;
`;

export default AlbumScreen;
