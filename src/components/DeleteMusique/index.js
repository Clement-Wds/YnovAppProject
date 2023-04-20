import React, {useState} from 'react';
import {Text, Alert} from 'react-native';
import {initializeApp} from 'firebase/app';
import config from '../../../firebase';
import {useEffect} from 'react';
import {firebase} from '@react-native-firebase/auth';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import 'firebase/storage';
import '@react-native-firebase/database';
import styled from 'styled-components/native';
import {getDatabase} from 'firebase/database';
import {ref, set, get} from 'firebase/database';
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

const DeleteMusique = () => {
  const [album, setAlbum] = useState('');
  const [selected, setSelected] = useState('');
  const [selected2, setSelected2] = useState('');
  const [selected3, setSelected3] = useState('');
  const {t} = useTranslation();

  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');

  const [albums, setAlbums] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [isSelected2, setSelection2] = useState(false);
  const [musiques, setMusiques] = useState([]);
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
          Alert.alert('error', error);
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
        setAlbums(albums);
      })
      .catch(error => {
        Alert.alert('error', error);
      });
  };

  const handleAlbumChange = () => {
    const selectedAlbum = selected2;
    setSelectedAlbum(selectedAlbum);

    fetchMusiquesByAlbum(selectedAlbum, selectedArtist);
  };

  const fetchMusiquesByAlbum = async (albumName, artistName) => {
    try {
      const musiquesRef = firebase
        .storage()
        .ref(`audio/artiste/${artistName}/${albumName}/`);

      const musiquesSnapshot = await musiquesRef.listAll();

      musiquesSnapshot.items.forEach(async musiqueSnapshot => {
        const musiqueName = musiqueSnapshot.name;
        setMusiques(prevMusiques => [...prevMusiques, musiqueName]);
      });
      return musiques;
    } catch (error) {
      Alert.alert(`Error getting musiques for album ${albumName}: ${error}`);
      return null;
    }
  };

  const handleDelete = async () => {
    if (selectedArtist) {
      const artistRef = ref(db, `artist/${selectedArtist}`);
      const storageRef = firebase.storage().ref();

      if (isSelected && selected2 && !isSelected2) {
        const albumRef = ref(db, `artist/${selectedArtist}/${selected2}`);

        // Delete album document from Firestore
        const albumDocRef = storageRef.child(
          `audio/artiste/${selectedArtist}/${selected2}`,
        );
        const photoFolderRef = storageRef.child(
          `audio/artiste/${selectedArtist}/${selected2}/photo`,
        );

        Promise.all([albumDocRef.listAll(), photoFolderRef.listAll()])
          .then(([res, photoRes]) => {
            const photoRef = photoRes.items[0];
            const deletePromises = res.items.map(itemRef => itemRef.delete());

            if (photoRef) {
              deletePromises.push(photoRef.delete());
            }

            Promise.all(deletePromises)
              .then(() => {
                Alert.alert('success', 'Files deleted successfully');
              })
              .catch(error => {
                Alert.alert('error', error);
              });
          })
          .catch(error => {
            Alert.alert('error', error);
          });

        // // Delete album from Realtime Database
        set(albumRef, null)
          .then(() =>
            Alert.alert(
              'success',
              'Album deleted successfully from Realtime Database!',
            ),
          )
          .catch(error => Alert.alert('error', error));
      } else if (isSelected2) {
        const musicDocRef = storageRef.child(
          `audio/artiste/${selectedArtist}/${selectedAlbum}/${musiques}`,
        );
        musicDocRef
          .delete()
          .then(() => {
            Alert.alert('success', 'Music deleted successfully!');
          })
          .catch(error => {
            Alert.alert('error', error);
          });
      } else {
        // Delete artist document from Firestore

        const artistDocRef = storageRef.child(
          `audio/artiste/${selectedArtist}`,
        );
        const artistPhotoRef = storageRef.child(
          `audio/artiste/${selectedArtist}/photo`,
        );

        artistDocRef
          .listAll()
          .then(res => {
            const deletePromises = [];

            res.prefixes.forEach(albumRef => {
              albumRef
                .listAll()
                .then(albumRes => {
                  albumRes.items.forEach(itemRef => {
                    deletePromises.push(itemRef.delete());
                  });
                  const albumPhotoRef = albumRef.child('photo');
                  albumPhotoRef
                    .listAll()
                    .then(photoRes => {
                      photoRes.items.forEach(itemRef => {
                        deletePromises.push(itemRef.delete());
                      });
                    })
                    .catch(error => {
                      Alert.alert('error', error);
                    });
                })
                .catch(error => {
                  Alert.alert('error', error);
                });
            });

            deletePromises.push(artistPhotoRef.delete());

            Promise.all(deletePromises)
              .then(() => {
                Alert.alert('success', 'Files deleted successfully');
              })
              .catch(error => {
                Alert.alert('error', error);
              });
          })
          .catch(error => {
            Alert.alert('error', error);
          });

        // Delete artist from Realtime Database
        set(artistRef, null)
          .then(() =>
            Alert.alert(
              'success',
              'Artist deleted successfully from Realtime Database!',
            ),
          )
          .catch(error => Alert.alert('error', error));
      }
    }
  };
  const handleSelection = newValue => {
    setSelection(newValue);
    setSelection2(newValue);
  };
  return (
    <Container>
      <Title>{t('resources.deleteMusic.deleteElement')}</Title>

      <DeleteSection>
        <Text>{t('resources.deleteMusic.deleteAlbum')}</Text>
        <CheckBox
          disabled={false}
          value={isSelected}
          onValueChange={newValue => setSelection(newValue)}
        />
        <Text>{t('resources.deleteMusic.deleteMusic')}e</Text>
        <CheckBox
          disabled={false}
          value={isSelected2}
          onValueChange={handleSelection}
        />

        <SelectList
          setSelected={val => setSelected(val)}
          data={artists}
          save="value"
          placeholder={t('resources.deleteMusic.selectArtist')}
          onSelect={handleArtistChange}
        />

        {isSelected ? (
          <SelectList
            setSelected={val => setSelected2(val)}
            data={albums}
            save="value"
            placeholder={t('resources.deleteMusic.selectAlbum')}
            onSelect={handleAlbumChange}
          />
        ) : null}

        {isSelected2 ? (
          <SelectList
            setSelected={val => setSelected3(val)}
            data={musiques}
            save="value"
            placeholder={t('resources.deleteMusic.selectMusic')}
          />
        ) : null}

        <Button
          title={t('resources.deleteMusic.delete')}
          onPress={handleDelete}
        />
      </DeleteSection>
    </Container>
  );
};

export default DeleteMusique;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const DeleteSection = styled.View`
  margin-top: 20px;
`;
