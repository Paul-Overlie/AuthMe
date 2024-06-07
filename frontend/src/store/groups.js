import { csrfFetch } from './csrf.js';
// import { useDispatch } from 'react-redux';

const RESTORE_GROUPS = 'groups/getGroups'
const RESTORE_EVENTS = 'groups/groupid/events'
const RESTORE_GROUP = 'get/groups/groupId'
const CREATE_GROUP = 'post/groups'
const SET_ERRORS = 'post/groups/bad'

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

const makeGroup = (group) => ({
  type: CREATE_GROUP,
  payload: group
})

const setGroupErrors = (err) => ({
  type: SET_ERRORS,
  payload: err
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

  export const createGroup = (body) => async dispatch => {
    let mainBody = {name:body.name, about:body.about, type:body.type, private:body.private, city:body.city, state:body.state}
    try{
      const response = await csrfFetch("/api/groups", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(mainBody)
      })
      const data = await response.json()
      dispatch(makeGroup(data))
      const response2 = await csrfFetch(`/api/groups/${data.id}/images`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url:body.image, preview: true})
      })
      const data2 = await response2.json()
      return {group:data, img:data2}
    }
    catch (e) {
      let err = await e.json()
      dispatch(setGroupErrors(err))
    }
  }

  const initialState = {groups: null}

  export function groupReducer(state = initialState, action) {
    switch (action.type) {
      case RESTORE_GROUPS:
        return { ...state, groups: action.payload };
      case RESTORE_EVENTS:
        return { ...state, events: action.payload }
      case RESTORE_GROUP:
        return { ...state, currGroup: action.payload }
      case CREATE_GROUP:
        return { ...state, madeGroup: action.payload }
      case SET_ERRORS:
        return { ...state, groupErrs: action.payload}
    //   case REMOVE_USER:
    //     return { ...state, user: null };
      default:
        return state;
    }
  }