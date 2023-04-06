import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ref, get, query, orderByChild, equalTo} from 'firebase/database';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import config from '../../firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const AlbumScreen = ({route}) => {
  const [albums, setAlbums] = useState([]);
  const {artist} = route.params;

  useEffect(() => {
    const albumRef = ref(db, 'album');
    const artistQuery = query(
      albumRef,
      orderByChild('artist'),
      equalTo(artist),
    );
    get(artistQuery)
      .then(snapshot => {
        const albums = [];
        snapshot.forEach(childSnapshot => {
          const album = {
            key: childSnapshot.key,
            ...childSnapshot.val(),
          };
          albums.push(album);
        });
        setAlbums(albums);
      })
      .catch(error => {
        console.log(error);
      });
  }, [artist]); // <= ajout de artist ici

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => console.log('Album selected:', item.title)}>
        <AlbumWrapper>
          <AlbumTitle>{item.title}</AlbumTitle>
        </AlbumWrapper>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <ArtistName>{artist}</ArtistName>
      <AlbumList
        data={albums}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </Container>
  );
};

const Container = styled.View`
  background-color: #121212;
  flex: 1;
  padding: 20px;
`;

const ArtistName = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const AlbumList = styled.FlatList`
  flex: 1;
  width: 100%;
  color: ${props => props.theme.colors.main};
`;

const AlbumWrapper = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const AlbumTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px;
`;

export default AlbumScreen;
