import {SELECT_AUDIO} from '../actions/selectAudio';

const initialState = {
  audio: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_AUDIO:
      return {
        ...state,
        audio: state.audio,
      };
  }
};
