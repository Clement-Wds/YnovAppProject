import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import {getDatabase} from 'firebase/database';
import styled from 'styled-components/native';
import config from '../../../firebase';
import {firebase} from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

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
  const [musiques, setMusiques] = useState([]);
  const [urlAlbum, setUrlAlbum] = useState('');

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
        Alert.alert('error', error);
      });
  }, [artist, title]);

  useEffect(() => {
    const storageRef = firebase.storage().ref();
    const albumDocRef = storageRef.child(`audio/artiste/${artist}/${title}`);

    albumDocRef
      .listAll()
      .then(res => {
        const mp3Files = res.items.filter(item => item.name.endsWith('.mp3'));
        const fileNames = mp3Files.map(file => file.name.replace('.mp3', ''));

        setMusiques(fileNames);
      })
      .catch(error => {
        Alert.alert('error', error);
      });

    // Listage de tous les fichiers dans le dossier "photo"
    storageRef
      .child(`audio/artiste/${artist}/${title}/photo`)
      .listAll()
      .then(res => {
        const photoFiles = res.items;
        const photoUrls = photoFiles.map(file => file.getDownloadURL());

        Promise.all(photoUrls).then(urls => {
          setUrlAlbum(urls[0]);
        });
      })
      .catch(error => {
        Alert.alert('error', error);
      });
  }, []);

  const renderItem = ({item}) => {
    return (
      <TrackWrapper>
        <View>
          <Text style={styles.widgetMusicTitle}>{item}</Text>
        </View>
        {/* <AudioPlayer source={{uri: item.audioUrl}} /> */}
      </TrackWrapper>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0000ff', '#00005f', '#191414']}
        style={styles.linearGradient}>
        <Image style={{width: 200, height: 200}} source={{uri: urlAlbum}} />
      </LinearGradient>
      <ArtistName>{artist}</ArtistName>

      <AlbumTitle>{album}</AlbumTitle>
      <TrackList
        data={musiques}
        renderItem={renderItem}
        keyExtractor={index => `${index}`}
      />
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  musicTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 20,
    marginBottom: 1,
  },
  artisteTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 1,
  },
  widgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#5E5A5A',
  },
  widgetMusicTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 10,
    marginBottom: 1,
  },
  widgetArtisteTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 1,
  },
  widgetImageStyle: {
    width: 55,
    height: 60,
    marginTop: 3,
  },
  linearGradient: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AlbumScreenCard;
