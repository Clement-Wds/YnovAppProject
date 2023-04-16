import { GET_ARTISTS } from "../actions/artist";

const initialState = {
    artist: []
}

const allArtistsReducers = (state = initialState, action) => {
    switch(action.type){
        case GET_ARTISTS:
            return{
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}

export default allArtistsReducers;