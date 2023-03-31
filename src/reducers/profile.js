import { PROFILE_DETAILS_REQUEST } from "../actions/profile";

const initialState = {
    user: null
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