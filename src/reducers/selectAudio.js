import {SELECT_AUDIO} from '../actions/selectAudio';

const initialState = {
  audio: [],
};

const selectAudio =  (state = initialState, action) => {
  switch (action.type) {
    case SELECT_AUDIO:
      return {
        ...state,
        audio: state.audio,
      };
  }
};

export default selectAudio;