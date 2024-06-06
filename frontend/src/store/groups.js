import { csrfFetch } from './csrf.js';
// import { useDispatch } from 'react-redux';

const RESTORE_GROUPS = 'groups/getGroups'
const RESTORE_EVENTS = 'groups/groupid/events'
const RESTORE_GROUP = 'get/groups/groupId'

const setGroups = (groups) => ({
type: RESTORE_GROUPS,
payload: groups
})

const setEvents = (groups) => ({
    type: RESTORE_EVENTS,
    payload: groups
})

const setGroup = (group) => ({
  type: RESTORE_GROUP,
  payload: group
})

export const restoreGroups = () => async dispatch => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(setGroups(data.Groups));
    return data.Groups;
  };

  
  export const restoreEvents = () => async dispatch => {
        const response = await csrfFetch("/api/events");
        const data = await response.json();
        dispatch(setEvents(data.Events));
    return data.Events;
  };

  export const restoreGroup = (groupId) => async dispatch => {
    const response = await csrfFetch("/api/groups/"+groupId)
    const data = await response.json()
    const response2 = await csrfFetch("/api/groups/"+groupId+"/events")
    const data2 = await response2.json()
    data.events = data2.Events
    dispatch(setGroup(data))
    return data
  }

  const initialState = {groups: null}

  export function groupReducer(state = initialState, action) {
    switch (action.type) {
      case RESTORE_GROUPS:
        return { ...state, groups: action.payload };
      case RESTORE_EVENTS:
        return { ...state, events: action.payload}
      case RESTORE_GROUP:
        return { ...state, currGroup: action.payload}
    //   case REMOVE_USER:
    //     return { ...state, user: null };
      default:
        return state;
    }
  }