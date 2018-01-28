/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';

const puzzleActiveList = require('containers/PuzzleActiveList/reducer').default;
const puzzlePage = require('containers/PuzzlePage/reducer').default;
const puzzleAddForm = require('containers/PuzzleAddForm/reducer').default;
const puzzleShowPage = require('containers/PuzzleShowPage/reducer').default;
const profilePage = require('containers/ProfilePage/reducer').default;
const userNavbar = require('./containers/UserNavbar/reducer.js').default;
const chat = require('containers/Chat/reducer').default;
const notifier = require('./containers/Notifier/reducer.js').default;

const initialReducers = {
  puzzleActiveList,
  puzzlePage,
  puzzleAddForm,
  puzzleShowPage,
  profilePage,
  userNavbar,
  chat,
  notifier,
};

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: { pathname: window.location.pathname },
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    language: languageProviderReducer,
    ...initialReducers,
    ...injectedReducers,
  });
}