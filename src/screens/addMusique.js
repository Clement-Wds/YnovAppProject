import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  Button,
  View,
  PermissionsAndroid,
} from 'react-native';
import {initializeApp} from 'firebase/app';
import config from '../../firebase';
import {useEffect} from 'react';
import {firebase} from '@react-native-firebase/auth';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import 'firebase/storage';
import '@react-native-firebase/database';
import TextInput from '../components/textInput';
import styled from 'styled-components/native';
import DocumentPicker from 'react-native-document-picker';
import {requestMultiple} from 'react-native-permissions';
import {getDatabase} from 'firebase/database';
import {ref, set, get} from 'firebase/database';

import {SelectList} from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';

// Initialiser Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const app = initializeApp(config);
const db = getDatabase(app);

const requestPermissions = async () => {
  const result = await requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.A,
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  ]);
  console.log(result);
};

const addMusique = () => {
  useEffect(() => {
    requestPermissions();
  }, []);

  const [audioFile, setAudioFile] = useState(null);
  const [artiste, setArtiste] = useState('');
  const [album, setAlbum] = useState('');
  const [selected, setSelected] = useState('');
  const [isSelected, setSelection] = useState(false);

  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  const [albums, setAlbums] = useState([]);

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
      const albumsRef = ref(db, 'album');
      const q = query(albumsRef, orderByChild('artist').equalTo(selectedArtist));
      get(q)
        .then(snapshot => {
          const albums = [];
          snapshot.forEach(childSnapshot => {
            const album = childSnapshot.val();
            albums.push(album);
          });
          setAlbums(albums);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedArtist]);
  const handleArtistChange = event => {
    const selectedArtist = event.target.value;
    setSelectedArtist(selectedArtist);
    // appel de la fonction pour récupérer les albums de l'artiste sélectionné
    fetchAlbumsByArtist(selectedArtist);
  };

  const fetchAlbumsByArtist = artist => {
    const albumsRef = ref(db, 'album');
    const q = query(albumsRef, orderByChild('artist').equalTo(artist));
    get(q)
      .then(snapshot => {
        const albums = [];
        snapshot.forEach(childSnapshot => {
          const album = childSnapshot.val();
          albums.push(album);
        });
        setAlbums(albums);
      })
      .catch(error => {
        console.log(error);
      });
  };


  // Récupérer une référence de stockage
  const storageRef = firebase.storage().ref();
  useEffect(() => {
    console.log(audioFile);
  }, [audioFile]);

  const handleAudioSelect = async () => {
    try {
      await requestPermissions();

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'documentDirectory',
        multiple: false,
        mode: 'open',
      });

      setAudioFile(result);
    } catch (err) {
      console.log('Error selecting audio file: ', err);
    }
  };

  const handleUpload = async () => {
    if (audioFile[0] && audioFile[0].name.endsWith('.mp3')) {
      const fileRef = storageRef.child(`audio/artiste/${audioFile[0].name}`);
      const task = fileRef.putFile(audioFile[0].fileCopyUri);
      task.on(
        'state_changed',
        snapshot => {
          // Handle upload progress if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error => {
          // Handle errors during upload if needed
          console.error(error);
        },
        async () => {
          // Handle successful upload

          const downloadURL = await fileRef.getDownloadURL();
          function cleanFileName(fileName) {
            return fileName.replace(/[.$#\[\]\/]/g, '_');
          }

          const databaseRef = firebase
            .database()
            .ref(`audios/artiste/${artiste}/${album}`)
            .push();
          const artistRef = ref(db, `artist/${artiste}`);
          const albumRef = ref(db, `artist/${artiste}/${album}`);
          const musicRef = ref(
            db,
            `artist/${artiste}/${album}/${cleanFileName(audioFile[0].name)}`,
          );

          Promise.all([get(artistRef), get(albumRef), get(musicRef)])
            .then(results => {
              const artistExists = results[0].exists();
              const albumExists = results[1].exists();
              const musicExists = results[2].exists();

              if (artistExists && albumExists && musicExists) {
                console.log(
                  "L'artiste, l'album et la musique existent déjà dans la base de données.",
                );
                return;
              } else if (artistExists && albumExists && !musicExists) {
                console.log(
                  "L'artiste et l'album existent déjà dans la base de données, mais pas la musique. Ajout de la musique...",
                );
                return set(musicRef, {name: cleanFileName(audioFile[0].name)});
              } else if (artistExists && !albumExists) {
                console.log(
                  "L'artiste existe déjà dans la base de données, mais pas l'album ni la musique. Ajout de l'album et de la musique...",
                );
                return set(albumRef, {
                  [cleanFileName(audioFile[0].name)]: {
                    name: cleanFileName(audioFile[0].name),
                  },
                });
              } else {
                console.log(
                  "L'artiste, l'album et la musique n'existent pas dans la base de données. Ajout de l'artiste, de l'album et de la musique...",
                );
                return set(artistRef, {
                  [album]: {
                    [cleanFileName(audioFile[0].name)]: {
                      name: cleanFileName(audioFile[0].name),
                    },
                  },
                });
              }
            })
            .then(() => {
              console.log('good');
            })
            .catch(error => {
              console.log(error);
            });

          console.log('hey');
          setAudioFile(null);
        },
      );
    } else {
      console.log('Invalid audio file uri or file type');
    }
  };

  return (
    <View>
      <SelectList
        setSelected={val => setSelected(val)}
        data={artists}
        save="value"
        placeholder="Selectionez un artiste"
        onChange={handleArtistChange}
      />


      <Text>L'artiste n'existe pas dans la liste?</Text>
      <CheckBox
        disabled={false}
        value={isSelected}
        onValueChange={newValue => setSelection(newValue)}
      />

{isSelected ? (
      <TextInput
        placeholder="Artiste"
        value={artiste}
        onChangeText={text => setArtiste(text)}
      />
      ) : null}
      <SelectList
        setSelected={val => setSelected(val)}
        data={albums}
        save="value"
        placeholder="Selectionez un album"
      />
     
      
        <TextInput
          placeholder="Album"
          value={album}
          onChangeText={text => setAlbum(text)}
        />
      

      <StyledTouchableOpacity onPress={handleAudioSelect}>
        <StyledText>
          {audioFile ? audioFile.name : 'Sélectionner un fichier audio'}
        </StyledText>
      </StyledTouchableOpacity>

      <Button title="Télécharger" onPress={handleUpload} />
    </View>
  );
};

export default addMusique;

const StyledTouchableOpacity = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #ccc;
  border-radius: 5px;
`;

const StyledText = styled(Text)`
  color: #fff;
`;
