import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
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
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/button';
import {useTranslation} from 'react-i18next';

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
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  ]);
  console.log(result);
};

const addMusique = () => {
  useEffect(() => {
    requestPermissions();
  }, []);
  const {t} = useTranslation();

  const [audioFile, setAudioFile] = useState(null);
  const [photoAlbumFile, setPhotoAlbumFile] = useState(null);
  const [photoArtistFile, setPhotoArtistFile] = useState(null);


  const [artiste, setArtiste] = useState('');
  const [album, setAlbum] = useState('');
  const [selected, setSelected] = useState('');
  const [selected2, setSelected2] = useState('');

  const [isSelected, setSelection] = useState(false);
  const [isSelected2, setSelection2] = useState(false);

  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  const [albums, setAlbums] = useState([]);
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

  // Récupérer une référence de stockage
  const storageRef = firebase.storage().ref();
  useEffect(
    () => {
      console.log(audioFile);
      console.log(photoAlbumFile);
    },
    [audioFile],
    [photoAlbumFile],
  );

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

  const handlePhotoAlbumSelect = async () => {
    try {
      await requestPermissions();

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'documentDirectory',
        multiple: false,
        mode: 'open',
      });

      setPhotoAlbumFile(result);
    } catch (err) {
      console.log('Error selecting photo file: ', err);
    }
  };

  const handlePhotoArtistSelect = async () => {
    try {
      await requestPermissions();

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'documentDirectory',
        multiple: false,
        mode: 'open',
      });

      setPhotoArtistFile(result);
    } catch (err) {
      console.log('Error selecting photo file: ', err);
    }
  };

  const handleUpload = async () => {
    if (audioFile[0] && audioFile[0].name.endsWith('.mp3')) {
      const fileRef = storageRef.child(
        `audio/artiste/${isSelected ? artiste : selected}/${album}/${
          audioFile[0].name
        }`,
      );
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

          if (photoAlbumFile && isSelected2) {
            const photoAlbumFileRef = storageRef.child(
              `audio/artiste/${isSelected ? artiste : selected}/${album}/photo/${
                photoAlbumFile[0].name
              }`,
            );
            const photoAlbumTask = photoAlbumFileRef.putFile(photoAlbumFile[0].fileCopyUri);
            photoAlbumTask.on(
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

                const photoDownloadURL = await photoAlbumFileRef.getDownloadURL();
                // Do something with the photo download URL
              },
            );
          }
          if (photoArtistFile && isSelected) {
            const photoArtistFileRef = storageRef.child(
              `audio/artiste/${artiste}/photo/${
                photoArtistFile[0].name
              }`,
            );
            const photoArtistTask = photoArtistFileRef.putFile(photoArtistFile[0].fileCopyUri);
            photoArtistTask.on(
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

                const photoArtistDownloadURL = await photoArtistFileRef.getDownloadURL();
                // Do something with the photo download URL
              },
            );
          }


          function cleanFileName(fileName) {
            return fileName.replace(/[.$#\[\]\/]/g, '_');
          }

          const artistRef = ref(
            db,
            `artist/${isSelected ? artiste : selected}`,
          );
          const albumRef = ref(
            db,
            `artist/${isSelected ? artiste : selected}/${
              isSelected2 ? album : selected2
            }`,
          );
          const musicRef = ref(
            db,
            `artist/${isSelected ? artiste : selected}/${
              isSelected2 ? album : selected2
            }/${cleanFileName(audioFile[0].name)}`,
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
          setPhotoAlbumFile(null);
          setArtiste(null);
          setAlbum(null);
          setSelection(null);
          setSelection2(null);
        },
      );
    } else {
      console.log('Invalid audio file uri or file type');
    }
  };
  const handleSelection = (newValue) => {
    setSelection(newValue);
    setSelection2(newValue);
  };

  return (
    <Container>
    <Title>{t('resources.addMusic.addElement')}</Title>

    <AddSection>
      {!isSelected ? (
        <SelectList
          setSelected={val => setSelected(val)}
          data={artists}
          save="value"
          placeholder={t('resources.addMusic.selectArtist')}
          onSelect={handleArtistChange}
        />
      ) : null}

      <Text>{t('resources.addMusic.artistDoesntExist')}</Text>
      <CheckBox
        disabled={false}
        value={isSelected}
        onValueChange={handleSelection}
      />

      {isSelected ? (
        <>
        <TextInput
          placeholder={t('resources.addMusic.artist')}
          value={artiste}
          onChangeText={text => setArtiste(text)}
        />
        <StyledTouchableOpacity onPress={handlePhotoArtistSelect}>
          <Text>
            {photoArtistFile ? photoArtistFile[0].name : t('resources.addMusic.selectArtistPhoto')}
          </Text>
        </StyledTouchableOpacity>

        </>

      ) : null}

      {!isSelected2 ? (
        <SelectList
          setSelected={val => setSelected2(val)}
          data={albums}
          save="value"
          placeholder={t('resources.addMusic.selectAlbum')}
        />
      ) : null}
      <Text>{t('resources.addMusic.albumDoesntExist')}</Text>
      <CheckBox
        disabled={false}
        value={isSelected2}
        onValueChange={newValue => setSelection2(newValue)}
      />
      {isSelected2 ? (
        <TextInput
          placeholder={t('resources.addMusic.album')}
          value={album}
          onChangeText={text => setAlbum(text)}
        />
      ) : null}

      {isSelected2 ? (
        <StyledTouchableOpacity onPress={handlePhotoAlbumSelect}>
          <Text>
            {photoAlbumFile ? photoAlbumFile[0].name : t('resources.addMusic.selectAlbumPhoto')}
          </Text>
        </StyledTouchableOpacity>
      ) : null}
      <StyledTouchableOpacity onPress={handleAudioSelect}>
        <Text>
          {audioFile ? audioFile[0].name : t('resources.addMusic.selectAudio')}
        </Text>
      </StyledTouchableOpacity>

      <Button title={t('resources.addMusic.download')}onPress={handleUpload} />
      <Button
        title={t('resources.addMusic.delete')}
        onPress={() => navigation.navigate('DeleteMusique')}
      />
      </AddSection>
  </Container>
  );
};

export default addMusique;

const StyledTouchableOpacity = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #ccc;
  border-radius: 5px;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;


const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const AddSection = styled.View`
  margin-top: 20px;
`;