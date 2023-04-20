import React, {useEffect, useState} from 'react';
import notifee from '@notifee/react-native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {musiclibrary} from '../../data';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayerScreen from '../../src/components/TrackPlayerScreen';
import PlayIcon from '../../src/assets/play.png';
import PauseIcon from '../../src/assets/pause.png';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress
} from 'react-native-track-player';

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

      // Create notification
      notifee.displayNotification({
        title: 'Musique',
        body: isPlaying ? 'Lecture en pause' : 'Lecture en cours',
        android: {
          channelId: 'music-player',
        },
      });

      const state = await TrackPlayer.getState();
      if (state === State.Paused && isCurrentTrack) {
        setIsPlaying(!isPlaying);
        TrackPlayer.play();
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
        <Pressable onPress={() => onSelectTrack(item, index)}>
          <View>
            <Text style={styles.musicTitle}>{item.title}</Text>
            <Text style={styles.artisteTitle}>{item.artist}</Text>
          </View>
        </Pressable>
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
          onClickLoop={()=> mode === "loop" ? setMode("loop") : setMode("off")}
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
                source={isPlaying ? PauseIcon : PlayIcon}                style={{height: 30, tintColor: '#fff', width: 30}}
              />
            </Pressable>
          </View>
        </Pressable>
      )}
    </View>
  );
}
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