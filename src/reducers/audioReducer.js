// audioReducer.js

const initialState = {
  audioFiles: [],
};

const audioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AUDIO_FILES':
      return {
        ...state,
        audioFiles: action.payload,
      };
    default:
      return state;
  }
};

export default audioReducer;
