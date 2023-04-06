import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import Sound from 'react-native-sound';
import {firebase} from '@react-native-firebase/storage';
import Slider from '@react-native-community/slider';

const LibraryScreen = () => {
  const {t} = useTranslation();
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  const [coverUrl, setCoverUrl] = useState(null);

  const app = firebase.app();

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const storageRef = firebase
          .storage()
          .ref()
          .child(
            'audio/artiste/Palmashow/Napz x SZH/Napz x SZH En Avance - Palmashow.mp3',
          );
        const audioURL = await storageRef.getDownloadURL(); // URL de votre fichier audio Firebase
        const audio = new Sound(audioURL, '', error => {
          if (error) {
            console.log('error loading audio', error);
          } else {
            setSound(audio);
            setDuration(audio.getDuration());
          }
        });
        const coverRef = firebase
          .storage()
          .ref()
          .child('audio/artiste/Palmashow/Napz x SZH/Palmashow.jpg');
        const coverURL = await coverRef.getDownloadURL(); // URL de la cover de votre fichier audio Firebase
        setCoverUrl(coverURL);
      } catch (error) {
        console.log('error loading audio', error);
      }
    };

    fetchAudio();

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const handlePlaySound = async () => {
    try {
      if (paused) {
        await sound.play();
        setPaused(false);
        setInterval(() => {
          sound.getCurrentTime(seconds => setPosition(seconds));
        }, 1000);
      } else {
        await sound.pause();
        setPaused(true);
      }
    } catch (error) {
      console.log('error playing sound', error);
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Container>
      <TopContainer>
        {coverUrl && <CoverImage source={{uri: coverUrl}} />}
        <Title>{t('resources.library.title')}</Title>
      </TopContainer>
      <Button onPress={handlePlaySound}>
        {paused ? (
          <PlayLogo source={require('../../assets/play.png')} />
        ) : (
          <PlayLogo source={require('../../assets/pause.png')} />
        )}
      </Button>
      <ProgressBarContainer>
        <ProgressBar
          maximumValue={duration}
          value={position}
          minimumTrackTintColor={'#FFFFFF'}
          maximumTrackTintColor={'#000000'}
          thumbTintColor={'#FFFFFF'}
          disabled={paused}
          formatText={formatTime}
          animateTransitions
        />
        <ProgressTime>{formatTime(position)}</ProgressTime>
        <DurationTime>{formatTime(duration)}</DurationTime>
      </ProgressBarContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

const PlayLogo = styled.Image`
  width: 30px;
  height: 30px;
  margin-bottom: 20px;
`;

const TopContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CoverImage = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #ffffff;
`;

const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => props.theme.colors.main};
  align-items: center;
  justify-content: center;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
`;

const ProgressBar = styled(Slider)`
  width: 100%;
  height: 20px;
`;

const ProgressTime = styled.Text`
  color: ${props => props.theme.colors.dark};
  margin-top: 10px;
  text-align: left;
  width: 100%;
`;

const DurationTime = styled.Text`
  color: ${props => props.theme.colors.dark};
  margin-top: 10px;
  text-align: right;
  width: 100%;
`;

export default LibraryScreen;
