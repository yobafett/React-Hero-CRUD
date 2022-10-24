import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
}

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers: {
        filtersFetching: state => {
            state.filtersLoadingStatus = 'loading';
        },
        filtersFetchingError: state => {
            state.filtersLoadingStatus = 'error';
        },
        filtersFetched: (state, action) => {
            state.filtersLoadingStatus = 'idle';
            state.filters = action.payload;
        },
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    }
})

const { reducer, actions } = filterSlice;

export default reducer;
export const {
    filtersFetching,
    filtersFetchingError,
    filtersFetched,
    activeFilterChanged
} = actions;