const LOAD = 'redux-example/projects/LOAD';
const LOAD_SUCCESS = 'redux-example/projects/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/projects/LOAD_FAIL';
const EDIT_START = 'redux-example/projects/EDIT_START';
const EDIT_STOP = 'redux-example/projects/EDIT_STOP';
const SAVE = 'redux-example/projects/SAVE';
const SAVE_SUCCESS = 'redux-example/projects/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-example/projects/SAVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.projects && globalState.projects.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/mobileapi/search-map?agg=15&category=2&currency=aed&distance=1&lat=25.197486&limit=100&long=55.275049')
    //promise: (client) => client.get('/projects/load/param1/param2') // params not used, just shown as demonstration
  };
}

export function save(project) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: project.id,
    promise: (client) => client.post('/projects/update', {
      data: project
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
