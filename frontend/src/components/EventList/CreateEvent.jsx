import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createEvent } from "../../store/event"
import { useSelector } from "react-redux"
import { restoreVenues } from "../../store/event"
import { useNavigate } from "react-router-dom"

export const CreateEvent = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const errors = useSelector(state => state.events.eventErrs)
    const venues = useSelector(state => state.events.venues)
    // console.log("SERVER VENUES: ",venues)

    let group = JSON.parse(localStorage.getItem("groupId"))
    // console.log("GROUP: ",group)

    const [name, setName] = useState("")
    const [inPerson, setInPerson] = useState("In person")
    const [price, setPrice] = useState(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [capacity, setCapacity] = useState(1)
    const [img, setImg] = useState("")
    const [description, setDescription] = useState("")
    const [venue, setVenue] = useState("")
    
    let currVenue
    if(venues && venues?.length>0){currVenue = venues.find(ven => ven.address === venue)}
    
    useEffect(() => {
        dispatch(restoreVenues(group.id))
    }, [dispatch, group.id])

    useEffect(() => {
        if(venues){
            setVenue(venues[0].address)
        }
    },[venues])
    

    const onSubmit = async (e) => {
        e.preventDefault()

        //fixing dates
        const fixDate = (body) => {
        if(body) {
            let [date, wholeTime] = body.split(", ")
            if(date) {
                let [month, day, year] = date.split("/")
                if(wholeTime) {
                    let [time, evening] = wholeTime.split(" ")
                    if(time) {
                        let [hour, minute] = time.split("/")
                        if(evening==="PM"){
                            if(hour!=='12'){hour = `${+hour+12}`}
                            else {hour = '00'; day=day+1}
                        }
                        return `${year}-${month}-${day} ${hour}:${minute}:00`}
                    }
                }
            }
        }
        let start = fixDate(startDate)
        let end = fixDate(endDate)
        //submitting thunk
        let newEvent = await dispatch(createEvent({name, inPerson, price, startDate:start, endDate:end, 
            img, description, groupId:group.id, capacity, venue:currVenue}))
        navigate("/events/"+newEvent.id)
    }

    return <div className="CreateEventFormContainer"><form onSubmit={onSubmit} className="CreateEventForm">
    <div>Create a new event for {group?.name}</div>
    <label>What is the name of your event?
        <input type="text" placeholder="Event Name"
        value={name} onChange={(e)=>{setName(e.target.value)}}/>
    </label>
    {errors?.name ?<div>{errors.name}</div> : null}
    <label>Is this an in-person or online group?
        <select value={inPerson} onChange={(e)=>{setInPerson(e.target.value)}}>
            <option>In person</option>
            <option>Online</option>
        </select>
    </label>
    {errors?.type ? <div>{errors.type}</div> : null}
    <label>What is the price of your event?
        <input type="number" placeholder="0" 
        value={price} onChange={(e)=>{setPrice(e.target.value)}}/>
    </label>
    {errors?.price ? <div>{errors.price}</div> : null}
    <label>When does your event start?
        <input type="text" placeholder="MM/DD/YYYY, HH/mm AM"
        value={startDate} onChange={(e)=>{setStartDate(e.target.value)}}/>
    </label>
    {errors?.startDate ? <div>{errors.startDate}</div> : null}
    <label>When does your event end?
        <input type="text" placeholder="MM/DD/YYYY, HH/mm PM"
        value={endDate} onChange={(e)=>{setEndDate(e.target.value)}}/>
    </label>
    {errors?.endDate ? <div>{errors.endDate}</div> : null}
    <label>How many people can attend?
        <input type="number" value={capacity} onChange={(e)=>{setCapacity(e.target.value)}}/>
    </label>
    {errors?.capacity ? <div>{errors.capacity}</div> : null}
    <label>Please add an image url for your event below.
        <input type="text" placeholder="Image URL"
        value={img} onChange={(e)=>{setImg(e.target.value)}}/>
    </label>
    {/* {errors?.img ? <div>{errors.img}</div> : null} */}
    <label>Please describe your event
        <textarea placeholder="Please include at least 30 characters"
        value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
    </label>
    {errors?.description ? <div>{errors.description}</div> : null}
    <label>{"What is your venue's name?"}
        <select type="text" value={venue} onChange={(e)=>{setVenue(e.target.value)}} placeholder="Venue Name">
            {venues?.length>0 ? venues.map(venue => {
                // console.log("OPTION: ",venue.address);
                return <option key={venue.id}>{venue.address}</option>
            })
             : null}
        </select>
    </label>
    <button>Create Event</button>
    </form>
    </div>
}