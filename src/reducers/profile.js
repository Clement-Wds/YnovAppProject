import { PROFILE_DETAILS_REQUEST } from "../actions/profile";

const initialState = {
    user: {
        displayName: null,
        email: null,
        pays: null,
        photoURL: null,
        isAdmin:null,
    },
}

const profileDetailsReducers = (state = initialState, action) => {
    switch(action.type){
        case PROFILE_DETAILS_REQUEST:
            return{
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}

export default profileDetailsReducers;