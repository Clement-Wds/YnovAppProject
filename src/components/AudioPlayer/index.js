import React from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import Slider from '@react-native-community/slider';

const AudioPlayer = ({
  coverUrl,
  paused,
  handlePlaySound,
  duration,
  position,
  formatTime,
}) => {
  const {t} = useTranslation();

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
        <ProgressTime>{formatTime(position)}</ProgressTime>
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
  margin-bottom: 20px;
  color: ${props => props.theme.colors.dark};
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 20px;
`;

const ProgressBar = styled(Slider)`
  width: 100%;
  height: 20px;
`;

const ProgressTime = styled.Text`
  color: ${props => props.theme.colors.dark};
  margin-right: 10px;
`;

const DurationTime = styled.Text`
  color: ${props => props.theme.colors.dark};
  margin-left: 10px;
`;

export default AudioPlayer;
