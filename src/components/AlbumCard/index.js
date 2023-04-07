import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import {getDatabase} from 'firebase/database';
import styled from 'styled-components/native';
import AudioPlayer from '../../components/AudioPlayer';
import config from '../../../firebase';
import {firebase} from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

// Initialize Firebase app
if (!firebase.apps.length) {
  initializeApp(config);
}
const db = getDatabase();

const AlbumScreenCard = () => {
  const route = useRoute();

  const {title, artist} = route.params;
  const [tracks, setTracks] = useState([]);
  const [album, setAlbum] = useState('');
  const [musiques, setMusiques] = useState([])

  useEffect(() => {
    const albumRef = ref(db, `artist/${artist}/${title}`);
    get(albumRef)
      .then(snapshot => {
        const tracks = [];
        snapshot.forEach(childSnapshot => {
          const track = childSnapshot.val();
          tracks.push(track);
        });
        setTracks(tracks);
        setAlbum(title);
      })
      .catch(error => {
        console.log(error);
      });
  }, [artist, title]);
  

  

  useEffect(() => {
    const storageRef = firebase.storage().ref();
    const albumDocRef = storageRef.child(`audio/artiste/${artist}/${title}`);
    albumDocRef.listAll().then((res) => {
      const mp3Files = res.items.filter((item) => item.name.endsWith('.mp3'));
      const fileNames = mp3Files.map((file) => file.name);
      const filePaths = mp3Files.map((file) => `audio/artiste/${artist}/${title}/${file.name}`);

      setMusiques(filePaths);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
  console.log(musiques)



  const renderItem = ({item}) => {
    return (
      <TrackWrapper>
        <TrackTitle>{item.title}</TrackTitle>
        {/* <AudioPlayer source={{uri: item.audioUrl}} /> */}
      </TrackWrapper>
    );
  };

  return (
    <Container>
      <AlbumTitle>{album}</AlbumTitle>
      <ArtistName>{artist}</ArtistName>
      <TrackList
        data={musiques}
        renderItem={renderItem}
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

const AlbumTitle = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ArtistName = styled.Text`
  color: #b3b3b3;
  font-size: 18px;
  margin-bottom: 20px;
`;

const TrackList = styled.FlatList`
  flex: 1;
  padding: 10px;
`;

const TrackWrapper = styled.View`
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 5px;
  margin: 5px;
  padding: 10px;
`;

const TrackTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export default AlbumScreenCard;
