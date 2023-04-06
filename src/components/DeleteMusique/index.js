import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  Button,
  View,
  PermissionsAndroid,
} from 'react-native';
import {initializeApp} from 'firebase/app';
import config from '../../../firebase';
import {useEffect} from 'react';
import {firebase} from '@react-native-firebase/auth';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import 'firebase/storage';
import '@react-native-firebase/database';
import TextInput from '../textInput';
import styled from 'styled-components/native';
import DocumentPicker from 'react-native-document-picker';
import {requestMultiple} from 'react-native-permissions';
import {getDatabase} from 'firebase/database';
import {ref, set, get, query, orderByChild, equalTo} from 'firebase/database';

import {SelectList} from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';

// Initialiser Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);
const [selected, setSelected] = useState('');
const [selected2, setSelected2] = useState('');
const [artists, setArtists] = useState([]);
const [albums, setAlbums] = useState([]);

const DeleteMusique = () => {
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
    if (selectedArtist) {
      const albumsRef = ref(db, `artist/${selectedArtist}`);
      get(albumsRef)
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
    }
  }, [selectedArtist]);

  const handleArtistChange = () => {
    const selectedArtist = selected;
    setSelectedArtist(selectedArtist);
    // appel de la fonction pour récupérer les albums de l'artiste sélectionné
    fetchAlbumsByArtist(selectedArtist);
  };

  const fetchAlbumsByArtist = artistName => {
    const albumsRef = ref(db, `artist/${artistName}/`);
    console.log('test');
    get(albumsRef)
      .then(snapshot => {
        const albums = [];
        snapshot.forEach(childSnapshot => {
          const album = childSnapshot.val();
          albums.push(album);
        });
        console.log('les albums sont' && album);
        setAlbums(albums);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <SelectList
          setSelected={val => setSelected(val)}
          data={artists}
          save="value"
          placeholder="Selectionez un artiste"
          onSelect={handleArtistChange}
        />

        <SelectList
          setSelected={val => setSelected2(val)}
          data={albums}
          save="value"
          placeholder="Selectionez un album"
        />



      
      <Text>Delete Musique </Text>




      
      <Button title="Télécharger" />
    </View>
  );
};

export default DeleteMusique;

const StyledTouchableOpacity = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #ccc;
  border-radius: 5px;
`;

const StyledText = styled(Text)`
  color: #fff;
`;
