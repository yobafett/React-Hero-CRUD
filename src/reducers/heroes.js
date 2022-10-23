import { createReducer } from "@reduxjs/toolkit"

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from "../actions"


const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

// В этом случае проблему иммутабельности на себя берет immerjs встроенная в toolkit
// Но в случае если функция будет возвращать значение, immerjs работать не будет
const heroes = createReducer(initialState, builder => {

    builder
        .addCase(heroesFetching, state => {
            state.heroesLoadingStatus = 'loading';
        })
        .addCase(heroesFetched, (state, action) => {
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus = 'error';
        })
        .addCase(heroCreated, (state, action) => {
            state.heroes.push(action.payload);
        })
        .addCase(heroDeleted, (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload);
        })
        .addDefaultCase(() => { });
})

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_CREATED':
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload]
//             }
//         case 'HERO_DELETED':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(item => item.id !== action.payload)
//             }
//         default: return state
//     }
// }

export default heroes;