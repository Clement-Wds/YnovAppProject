export const PROFILE_DETAILS_REQUEST = 'PROFILE_DETAILS_REQUEST';

export const profileDetailsRequest = (user) => ({
    type: PROFILE_DETAILS_REQUEST,
    payload: user
});