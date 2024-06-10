import { csrfFetch } from './csrf.js';

const RESTORE_EVENT = 'get/events/eventId'
const RESTORE_EVENTS = 'get/events'
const CREATE_EVENT = 'post/groups/groupId/events'
const SET_EVENT_ERRORS = 'post/groupsAndEventGroupErrors'
const SET_VENUES = 'post/groups/groupId/venues'
const REMOVE_EVENT = 'delete/events/eventId'

const setEvent = (event) => ({
    type: RESTORE_EVENT,
    payload: event
  })

const setEvents = (events) => ({
    type: RESTORE_EVENTS,
    payload: events
})

const makeEvent = (event) => ({
  type: CREATE_EVENT,
  payload: event
})

const setErrors = (err) => ({
  type: SET_EVENT_ERRORS,
  payload: err
})

const setVenues = (venues) => ({
  type: SET_VENUES,
  payload: venues
})

const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  payload: eventId
})

export const restoreEvent = (eventId) => async dispatch => {
    const response = await csrfFetch("/api/events/"+eventId)
    const data = await response.json()
    const response2 = await csrfFetch("/api/groups/"+data.groupId)
    const data2 = await response2.json()
    console.log("DATA2",data2)
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

export const createEvent = (body) => async dispatch => {
  try {
    const response = await csrfFetch(`/api/groups/`+body.groupId+`/events`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name:body.name, type:body.inPerson, 
        price:body.price, startDate:body.startDate, endDate:body.endDate, 
        description:body.description, capacity:body.capacity, venueId:1})
    })
    const data = await response.json()
    await csrfFetch("/api/events/"+data.id+"/images", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({url:body.venue.id, preview:true})
    })
    dispatch(makeEvent(data))
    return data
} catch (error) {
  let err = await error
  dispatch(setErrors(err.errors))
}
}

export const restoreVenues = (groupId) => async dispatch => {
  const response = await csrfFetch('/api/groups/'+groupId+'/venues')
  const data = await response.json()
  dispatch(setVenues(data.Venues))
}

export const deleteEvent = (eventId) => async dispatch => {
  const response = await csrfFetch("/api/events/"+eventId, {
    method: "DELETE"
  })
  const data = await response.json()
  console.log("DATA: ",data)
  dispatch(removeEvent(eventId))
  return
}

const initialState = {events: null}

export function eventReducer(state = initialState, action) {
    switch (action.type) {
      case RESTORE_EVENT:
        return { ...state, currEvent: action.payload };
      case RESTORE_EVENTS:
        return { ...state, events: action.payload}
      case CREATE_EVENT:
        return { ...state, madeEvent: action.payload}
      case SET_EVENT_ERRORS:
        return { ...state, eventErrs: action.payload}
      case SET_VENUES:
        return { ...state, venues: action.payload}
      case REMOVE_EVENT:
        return { ...state, events: { ...state.events,  } };
      default:
        return state;
    }
  }