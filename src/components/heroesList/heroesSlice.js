import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

const heroSlice = createSlice({
    name: 'heroes',
    initialState: initialState,
    reducers: {
        heroesFetching: state => {
            state.heroesLoadingStatus = 'loading';
        },
        heroesFetchingError: state => {
            state.heroesLoadingStatus = 'error';
        },
        heroesFetched: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes.filter(item => item.id !== action.payload);
        }
    }
})

const { reducer, actions } = heroSlice;

export default reducer;
export const {
    heroesFetching,
    heroesFetchingError,
    heroesFetched,
    heroCreated,
    heroDeleted
} = actions;