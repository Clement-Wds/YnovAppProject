import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  Button,
  View,
  PermissionsAndroid,
} from 'react-native';
import {getAuth} from 'firebase/auth';
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
import {ref, set} from 'firebase/database';
const OPEN_DOCUMENT = 'android.intent.action.OPEN_DOCUMENT';

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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [inputs, setInputs] = useState({name: ''});

  const addArtist = async () => {
    set(ref(db, 'artist/' + inputs.name), {
      username: inputs,
    })
      .then(() => {
        console.log('Good');
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

          const databaseRef = firebase.database().ref('audios/artiste').push();
          console.log('hey');
          await databaseRef.set({
            title,
            description,
            audioURL: downloadURL,
          });
          setTitle('');
          setDescription('');
          setAudioFile(null);
        },
      );
    } else {
      console.log('Invalid audio file uri or file type');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={text => setTitle(text)}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
      />
      <TextInput
        placeholder="Artist name"
        value={inputs.name}
        onChangeText={text => setInputs({name: text})}
      />

      <StyledTouchableOpacity onPress={handleAudioSelect}>
        <StyledText>
          {audioFile ? audioFile.name : 'Sélectionner un fichier audio'}
        </StyledText>
      </StyledTouchableOpacity>

      <Button title="Télécharger" onPress={handleUpload} />
      <Button title="Télécharger Artiste" onPress={addArtist} />
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
