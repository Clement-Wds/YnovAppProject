import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import {musiclibrary} from '../../data';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayerScreen from '../../src/components/TrackPlayerScreen';
import PlayIcon from '../../src/assets/play.png';
import PauseIcon from '../../src/assets/pause.png';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import {initializeApp} from 'firebase/app';
import {ref, get} from 'firebase/database';
import {getDatabase} from 'firebase/database';
import {firebase} from '@react-native-firebase/auth';
import config from '../../firebase';

import {useSelector, useDispatch} from 'react-redux';
import {profileDetailsRequest} from '../actions/profile';
import notifee from '@notifee/react-native';

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.RemotePlay,
  Event.RemotePause,
];

export default function TrackListScreen() {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(null);
  const [isPlayerModalVisible, setisPlayerModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [mode, setMode] = useState('shuffle');
  const {position} = useProgress();

  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);
  console.log('STATE : ' + profileState);

  useEffect(() => {
    if (user) {
      //UTILISATION DE REDUX pour afficher l'utilisateur
      dispatch(profileDetailsRequest(user));
    }
  }, [user]);

  console.log('USER UID : ', profileState?.uid);

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occurred while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      console.log(event.type);
    }
    if (event.type === Event.RemotePlay) {
      console.log(event.type);
    }
    if (event.type === Event.RemotePause) {
      console.log(event.type);
    }
  });
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  const app = initializeApp(config);
  const db = getDatabase(app);

  const PlaylistImageView = () => (
    <>
      <LinearGradient
        colors={['#0000ff', '#00005f', '#191414']}
        style={styles.linearGradient}>
        <Image
          style={{width: 200, height: 200}}
          source={{uri: 'https://www.bensound.com/bensound-img/punky.jpg'}}
        />
      </LinearGradient>
    </>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          //Name of the song   //Artist name
          `Hey, I am listening to ${selectedMusic.title} by ${selectedMusic.artist} on YnovApp. You should check it out!`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onSelectTrack = async (selectedTrack, index) => {
    setSelectedMusic(selectedTrack);
    setTimestamp(0);
    setSelectedMusicIndex(index);
    // remove TrackPlayer.skip(index);
    // playOrPause();
  };
  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occurred while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      console.log(event.type);
    }
    if (event.type === Event.RemotePlay) {
      console.log(event.type);
    }
    if (event.type === Event.RemotePause) {
      console.log(event.type);
    }
  });

  const playOrPause = async isCurrentTrack => {
    const state = await TrackPlayer.getState();
    if (state === State.Paused && isCurrentTrack) {
      setIsPlaying(!isPlaying);
      TrackPlayer.play();

      await notifee.createChannel({
        id: 'music',
        name: 'Lecture en cours',
      });

      await notifee.displayNotification({
        title: 'Lecture en cours',
        body: 'Vous écoutez de la musique !',
        android: {
          channelId: 'music',
        },
      });

      return;
    }
    if (state === State.Playing && isCurrentTrack) {
      setIsPlaying(!isPlaying);
      TrackPlayer.pause();
      return;
    }
    setIsPlaying(true);
    TrackPlayer.play();
  };

  const onSeekTrack = newTimeStamp => {
    TrackPlayer.seekTo(newTimeStamp);
  };
  const onPressNext = () => {
    setSelectedMusic(
      musiclibrary[(selectedMusicIndex + 1) % musiclibrary.length],
    );
    setSelectedMusicIndex(selectedMusicIndex + 1);
    TrackPlayer.skipToNext();
    playOrPause();
  };
  const onPressPrev = () => {
    if (selectedMusicIndex === 0) {
      return;
    }
    setSelectedMusic(
      musiclibrary[(selectedMusicIndex - 1) % musiclibrary.length],
    );
    setSelectedMusicIndex(selectedMusicIndex - 1);
    TrackPlayer.skipToPrevious();
    playOrPause();
  };
  const renderSingleMusic = ({item, index}) => {
    return (
      <>
        {index === 0 && <PlaylistImageView />}
        <MusicItem>
          <Pressable onPress={() => onSelectTrack(item, index)}>
            <View>
              <MusicTitle>{item.title}</MusicTitle>
              <ArtisteTitle>{item.artist}</ArtisteTitle>
            </View>
          </Pressable>
          <Pressable onPress={() => onShare()}>
            <Logo source={require('../assets/share.png')} />
          </Pressable>
        </MusicItem>
      </>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView />
      {selectedMusic && (
        <TrackPlayerScreen
          onCloseModal={() => setisPlayerModalVisible(false)}
          isVisible={isPlayerModalVisible}
          isPlaying={isPlaying}
          playOrPause={playOrPause}
          selectedMusic={selectedMusic}
          onSeekTrack={onSeekTrack}
          timestamp={Math.round(position)}
          onPressNext={onPressNext}
          onPressPrev={onPressPrev}
          playbackMode={mode}
          onClickLoop={() =>
            mode === 'loop' ? setMode('loop') : setMode('off')
          }
        />
      )}
      <View style={[styles.widgetContainer, {justifyContent: 'center'}]}>
        <Text style={styles.musicTitle}>Mettre le nom de la playlist</Text>
      </View>

      <FlatList
        data={musiclibrary}
        keyExtractor={item => item.url}
        renderItem={renderSingleMusic}
      />

      {selectedMusic && (
        <Pressable onPress={() => setisPlayerModalVisible(true)}>
          <View style={[styles.widgetContainer, {}]}>
            <View style={{flexDirection: 'row'}}>
              <Image
                resizeMode="cover"
                source={{uri: selectedMusic.artwork}}
                style={styles.widgetImageStyle}
              />

              <View>
                <Text style={styles.widgetMusicTitle}>
                  {selectedMusic.title}
                </Text>
                <Text style={styles.widgetArtisteTitle}>
                  {selectedMusic.artist}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => playOrPause()}>
              <Image
                source={isPlaying ? PauseIcon : PlayIcon}
                style={{height: 30, tintColor: '#fff', width: 30}}
              />
            </Pressable>
          </View>
        </Pressable>
      )}
    </View>
  );
}
const MusicItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const MusicTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.main};
`;

const ArtisteTitle = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.main};
`;

const Logo = styled.Image`
  width: 20px;
  height: 20px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  musicTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 20,
    marginBottom: 1,
  },
  artisteTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 1,
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
  widgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#5E5A5A',
  },
  widgetMusicTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 10,
    marginBottom: 1,
  },
  widgetArtisteTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 1,
  },
  widgetImageStyle: {
    width: 55,
    height: 60,
    marginTop: 3,
  },
  linearGradient: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
