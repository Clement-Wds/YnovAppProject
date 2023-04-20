import React, {useEffect} from 'react';
import {FlatList, Alert} from 'react-native';
import {useDispatch, useSelector} from 'redux';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import styled from 'styled-components/native';

// Action types
const SET_AUDIO_FILES = 'SET_AUDIO_FILES';

// Action creators
const setAudioFiles = audioFiles => ({
  type: SET_AUDIO_FILES,
  payload: audioFiles,
});

// Reducer
const audioReducer = (state = [], action) => {
  switch (action.type) {
    case SET_AUDIO_FILES:
      return action.payload;
    default:
      return state;
  }
};

const ShowAudio = () => {
  const dispatch = useDispatch();
  const audioFiles = useSelector(state => state.audioFiles);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const audioCollection = collection(db, 'audio');
      const audioSnapshot = await getDocs(audioCollection);
      const audioData = audioSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setAudioFiles(audioData));
    };
    fetchData();
  }, [dispatch]);

  const handlePlayAudio = async title => {
    const audioRef = ref(getStorage(), `audio/${title}.mp3`);
    const audioURL = await getDownloadURL(audioRef);
  };

  const renderAudioItem = ({item}) => {
    return (
      <AudioItem onPress={() => handlePlayAudio(item.title)}>
        <Title>{item.title}</Title>
      </AudioItem>
    );
  };

  return (
    <Container>
      <FlatList
        data={audioFiles}
        renderItem={renderAudioItem}
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const AudioItem = styled.TouchableOpacity`
  padding: 10px;
  border-bottom-width: 1px;
  border-color: #ccc;
`;

const Title = styled.Text`
  font-size: 16px;
`;

export default ShowAudio;
