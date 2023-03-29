import React, { useState } from 'react';
import { Button, View } from 'react-native';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import '@react-native-firebase/firestore';
import config from '../../firebase';
import {initializeApp} from 'firebase/app';
import TextInput from '../components/textInput'
import FileInput from '../components/fileInput'

const uploadFileToFirebase = async (file, filename) => {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const blob = new Blob([reader.result], { type: 'audio/mp3' });
        const ref = firebase.storage().ref().child(`audio/${filename}.mp3`);
        await ref.put(blob);
        const url = await ref.getDownloadURL();
        resolve(url);
      };
      reader.onerror = reject;
    });
  };


const addMusique = () => {

    const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const handleUpload = async () => {
    const url = await uploadFileToFirebase(audioFile, title);
    // Ici, vous pouvez enregistrer l'URL, le titre et la description dans votre base de données Firebase
    // ou faire toute autre opération avec les données téléchargées
  };

  const handleAudioFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };
  return (
    <View>
    <TextInput
      placeholder="Titre"
      value={title}
      onChangeText={(text) => setTitle(text)}
    />
    
    <TextInput
      placeholder="Description"
      value={description}
      onChangeText={(text) => setDescription(text)}
    />
    <FileInput />

   
    
    <Button title="Télécharger" onPress={handleUpload} />
  </View>
  );
};
export default addMusique;







