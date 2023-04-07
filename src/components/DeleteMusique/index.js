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
import styled from 'styled-components/native';
import {requestMultiple} from 'react-native-permissions';
import {getDatabase} from 'firebase/database';
import {ref , set, get, query, orderByChild, equalTo} from 'firebase/database';
import firestore from "@react-native-firebase/firestore";

import {SelectList} from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';

// Initialiser Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const DeleteMusique = () => {

  const [album, setAlbum] = useState('');
  const [selected, setSelected] = useState('');
  const [selected2, setSelected2] = useState('');

  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  const [albums, setAlbums] = useState([]);
  const [isSelected, setSelection] = useState(false);

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


  const handleDelete = async () => {
    if (selectedArtist) {
      const artistRef = ref(db, `artist/${selectedArtist}`);
      const storageRef = firebase.storage().ref();

  
      if (isSelected && selected2) {
        const albumRef = ref(db, `artist/${selectedArtist}/${selected2}`);
  
        // Delete album document from Firestore
       
          const albumDocRef = storageRef.child(`audio/artiste/${selectedArtist}/${selected2}`);
          albumDocRef.listAll().then((res)=>{
            res.items.forEach((itemRef)=>{
              itemRef.delete().then(()=>{
                console.log('File deleted Successfully');
              }).catch((error)=>{
                console.error(error);
              });
            });
          }).catch((error)=>{
            console.error(error);
          });
        
  
        // // Delete album from Realtime Database
         set(albumRef, null)
           .then(() =>
             console.log("Album deleted successfully from Realtime Database!")
           )
           .catch((error) => console.log(error));


      } else {
        // Delete all albums of the artist from Firestore
       
  
        // Delete artist document from Firestore
        const artistDocRef =  storageRef.child(
          `audio/artiste/${selectedArtist}/`
        );

        artistDocRef.listAll().then((res) => {
          res.prefixes.forEach((albumRef) => {
            albumRef.listAll().then((albumRes) => {
              albumRes.items.forEach((itemRef) => {
                itemRef.delete().then(() => {
                  console.log('File deleted successfully!');
                }).catch((error) => {
                  console.error(error);
                });
              });
            }).catch((error) => {
              console.error(error);
            });
          });
        }).catch((error) => {
          console.error(error);
        });
        
        
  
        // Delete artist from Realtime Database
         set(artistRef, null)
           .then(() =>
             console.log("Artist deleted successfully from Realtime Database!")
           )
           .catch((error) => console.log(error));
      }
    }
  };
  
  return (
    <View>
      
      <Text>Supprimer un album</Text>
      <CheckBox
        disabled={false}
        value={isSelected}
        onValueChange={newValue => setSelection(newValue)}
      />


      <SelectList
          setSelected={val => setSelected(val)}
          data={artists}
          save="value"
          placeholder="Selectionez un artiste"
          onSelect={handleArtistChange}
        />
        {isSelected ?(

        <SelectList
          setSelected={val => setSelected2(val)}
          data={albums}
          save="value"
          placeholder="Selectionez un album"
        />
        ):null}



      

      
      <Button title="Supprimer" onPress={handleDelete} />
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
