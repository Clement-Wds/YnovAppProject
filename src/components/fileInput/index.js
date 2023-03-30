import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import DocumentPicker from 'react-native-document-picker';

const StyledTouchableOpacity = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #ccc;
  border-radius: 5px;
`;

const StyledText = styled(Text)`
  color: #fff;
`;

const AudioInput = () => {
  const [audioFile, setAudioFile] = useState(null);

  const handleAudioSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      setAudioFile(result);
    } catch (err) {
      console.log('Error selecting audio file: ', err);
    }
  };

  return (
    <StyledTouchableOpacity onPress={handleAudioSelect}>
      <StyledText>{audioFile ? audioFile.name : 'Sélectionner un fichier audio'}</StyledText>
    </StyledTouchableOpacity>
  );
};

export default AudioInput;
