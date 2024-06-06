import { restoreGroups, restoreEvents } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

const GroupList = () => {
const dispatch = useDispatch()

let groups = useSelector(state => state.groups.groups)
let events = useSelector(state => state.groups.events)

groups?.forEach(group => {
    group.events = []
})


groups?.forEach(group => {
    let currEvent = events?.filter(event => {return group.id===event.groupId})
    currEvent ? group.events = currEvent : group.events = [] 
})


useEffect (() => {
    dispatch(restoreGroups())
    dispatch(restoreEvents())
}, [dispatch])


    return <>
    <div>
        <div>Events</div>
        <div>Groups</div>
    </div>
    <div>
        <div>Groups in Meetup</div>
        {groups?.map(group=>
        {
            return <NavLink to={"/groups/"+group.id} key={group.id}>
                <img src={group.previewImage}/>
                <div>{group.name}</div>
                <div>{group.city}, {group.state}</div>
                <div>{group.about}</div>
                <div>{group.events.length} event(s)</div>
                <div>•</div>
                <div>{group.private?"Private":"Public"}</div>
            </NavLink>})}
    </div>
    </>
}

export default GroupList