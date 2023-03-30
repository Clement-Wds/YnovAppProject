import {SET_TITLE, SET_DESCRIPTION, SET_AUDIO_FILE, SET_ARTISTE, SET_ALBUM} from '../actions/selectAudio';

const initialState = {
  title: '',
  description: '',
  audioFile: null,
  artiste: '',
  album: ''
};

const selectAudio = (state = initialState, action) => {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        title: state.title,
      };
    case SET_DESCRIPTION:
      return {
        ...state,
        title: state.description,
      };
    case SET_AUDIO_FILE:
      return {
        ...state,
        audioFile: state.audioFile,
      };
    case SET_ARTISTE:
      return {
        ...state,
        title: state.artiste,
      };
    case SET_ALBUM:
      return {
        ...state,
        title: state.album,
      };
    default:
      return state;
  }
};

export default selectAudio;