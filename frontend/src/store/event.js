import { csrfFetch } from './csrf.js';

const RESTORE_EVENT = 'get/events/eventId'
const RESTORE_EVENTS = 'get/events'

const setEvent = (event) => ({
    type: RESTORE_EVENT,
    payload: event
  })

const setEvents = (events) => ({
    type: RESTORE_EVENTS,
    payload: events
})

export const restoreEvent = (eventId) => async dispatch => {
    const response = await csrfFetch("/api/events/"+eventId)
    const data = await response.json()
    const response2 = await csrfFetch("/api/groups/"+data.groupId)
    const data2 = await response2.json()
    data.organizer = {}
    data.organizer.firstName = data2.Organizer.firstName
    data.organizer.lastName = data2.Organizer.lastName
    data.organizer.id = data2.Organizer.id
    data.groupImages = data2.GroupImages
    dispatch(setEvent(data))
    return data
  }

export const restoreEventsList = () => async dispatch => {
    const response = await csrfFetch("/api/events")
    const data = await response.json()
    dispatch(setEvents(data.Events))
    return data
} 

const initialState = {events: null}

export function eventReducer(state = initialState, action) {
    switch (action.type) {
      case RESTORE_EVENT:
        return { ...state, currEvent: action.payload };
      case RESTORE_EVENTS:
        return { ...state, events: action.payload}
    //   case RESTORE_EVENTS:
    //     return { ...state, events: action.payload}
    //   case RESTORE_GROUP:
    //     return { ...state, currGroup: action.payload}
    //   case REMOVE_USER:
    //     return { ...state, user: null };
      default:
        return state;
    }
  }