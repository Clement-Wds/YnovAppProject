import React, { useEffect,useState } from 'react';
import {View, Text, Modal, Image, StyleSheet, Pressable} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import ShuffleIcon from '../../assets/shuffle.png';
import PrevIcon from '../../assets/prev.png';
import NextIcon from '../../assets/next.png';
import LoopIcon from '../../assets/loop.png';
import PlayIcon from '../../assets/play.png';
import PauseIcon from '../../assets/pause.png';
import MenuIcon from '../../assets/down.png';
import {secsToTimestamp} from '../../config/timeFormat';

import { useSelector, useDispatch } from 'react-redux';
import {profileDetailsRequest} from "../../actions/profile";

export default function TrackPlayerScreen({
  isVisible,
  onCloseModal,
  selectedMusic,
  isPlaying,
  playOrPause,
  onSeekTrack,
  timestamp,
  onPressNext,
  onPressPrev,
  playbackMode,
  onClickShuffle,
  onClickLoop,
}) {

  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile.user);
  console.log("STATE : " + profileState);

  useEffect(() => {
    if(user) {
      //UTILISATION DE REDUX pour afficher l'utilisateur
      dispatch(profileDetailsRequest(user));
    }
  }, [user]);

  console.log("USER UID : ", profileState?.uid);
  
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="fullScreen">
      <LinearGradient
        colors={['#0000ff', '#00005f', '#191414']}
        style={styles.container}>
        <Pressable
          onPress={onCloseModal}
          style={{
            position: 'absolute',
            top: 45,
            left: 30,
          }}>
          <Image
            source={MenuIcon}
            style={{
              width: 15,
              height: 15,
              tintColor: '#fff',
            }}
          />
        </Pressable>
        <Text style={styles.mainText}>Playing from My Playlist</Text>
        <Text style={[styles.mainText, {fontWeight: 'bold'}]}>
          {selectedMusic.album}
        </Text>
        <Image
          style={{width: 350, height: 350, marginVertical: 75}}
          source={{uri: selectedMusic.artwork}}
        />
        <View style={{justifyContent: 'space-between', width: '100%'}}>
          <View>
            <Text style={styles.boldMainText}>{selectedMusic.title}</Text>
            <Text style={styles.mainText}>{selectedMusic.artist}</Text>
          </View>
        </View>
        <Slider
          tapToSeek={true}
          minimumTrackTintColor="#fff"
          onValueChange={e => {
            onSeekTrack(Math.floor(e * selectedMusic.duration));
          }}
          style={{width: '100%', paddingHorizontal: 10}}
          value={timestamp / selectedMusic.duration}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Text style={styles.mainText}>{secsToTimestamp(timestamp)}</Text>
          <Text style={styles.mainText}>
            {secsToTimestamp(selectedMusic.duration - timestamp)}
          </Text>
        </View>
        <View style={styles.timeStampHolder}>
          <View/>
          <Pressable onPress={onPressPrev}>
            <Image style={styles.iconWidth} source={PrevIcon} />
          </Pressable>
          <Pressable onPress={playOrPause} style={styles.playButtonHolder}>
            <Image
              style={[styles.iconWidth, {tintColor: '#000'}]}
              source={isPlaying ? PauseIcon : PlayIcon}            />
          </Pressable>
          <Pressable onPress={onPressNext}>
            <Image style={styles.iconWidth} source={NextIcon} />
          </Pressable>
          <Pressable onPress={onClickLoop}>
            <Image
              style={[
                styles.iconWidth,
                {tintColor: playbackMode === 'loop' ? '#1DB954' : '#fff'},
              ]}
              source={LoopIcon}
            />
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 20,
  },
  boldMainText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 20,
    marginBottom: 1,
  },
  mainText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginHorizontal: 20,
    // marginBottom: 12,
    // marginTop: 1,
  },
  linearGradient: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWidth: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  timeStampHolder: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  playButtonHolder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});