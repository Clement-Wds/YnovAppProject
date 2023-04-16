import {combineReducers} from 'redux';
//import audio from './selectAudio';
import profile from './profile';
import artist from './artist';

export default combineReducers({
  profile,
  artist,
});
