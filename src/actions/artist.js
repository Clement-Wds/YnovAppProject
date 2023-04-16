export const GET_ARTISTS = "GET_ARTISTS";

export const getAllArtists = (artist) => ({
    type: GET_ARTISTS,
    payload: artist
});