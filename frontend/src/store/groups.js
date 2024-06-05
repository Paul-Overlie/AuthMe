import { csrfFetch } from './csrf.js';
// import { useDispatch } from 'react-redux';

const RESTORE_GROUPS = 'groups/getGroups'
const GET_GROUP_EVENTS = 'groups/groupid/events'

const setGroups = (groups) => ({
type: RESTORE_GROUPS,
payload: groups
})

const getEvents = (groups) => ({
    type: GET_GROUP_EVENTS,
    payload: groups
})

export const restoreGroups = () => async dispatch => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(setGroups(data.Groups));
    return data.Groups;
  };

  
  export const addGroupEvents = (groups={}) => async dispatch => {
    let newGroups = structuredClone(groups)
    newGroups?.forEach(async group => {
        const response = await csrfFetch("/api/groups/"+group.id+"/events");
        const data = await response.json();
        group.events = data.Events
    })
    dispatch(getEvents(newGroups));
    console.log("groups: ", newGroups)
    console.log("First Group's Events: ",newGroups[0].events)
    return newGroups;
  };

  const initialState = {groups: null}

  export function groupReducer(state = initialState, action) {
    switch (action.type) {
      case RESTORE_GROUPS:
        return { ...state, groups: action.payload };
      case GET_GROUP_EVENTS:
        return { ...state, currGroupEvent: action.payload}
    //   case REMOVE_USER:
    //     return { ...state, user: null };
      default:
        return state;
    }
  }