import { restoreGroups, addGroupEvents } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

const GroupList = () => {
const dispatch = useDispatch()
let groups = useSelector(state => state.groups.groups)

let currGroups = useSelector(state => state.groups.currGroupEvent)


useEffect (() => {
    dispatch(restoreGroups())
}, [dispatch])

useEffect (() => {
    if(groups && Object.values(groups).length>0){dispatch(addGroupEvents(groups))}
}, [dispatch, groups])


// console.log("Current Group Event: ",currGroups)

// console.log("WHY OH WHY: ",currGroups?currGroups[0].events: null)

    return <>
    <div>
        <div>Events</div>
        <div>Groups</div>
    </div>
    <div>
        <div>Groups in Meetup</div>
        {currGroups?.map(group=>
        {
            // {console.log("This group: ",(group))}
            return <div key={group.id}>
                <img src={group.previewImage}/>
                <div>{group.name}</div>
                <div>{group.city}, {group.state}</div>
                <div>{group.about}</div>
                {/* <div>{group.events.length} events</div> */}
                <div>•</div>
                <div>{group.private?"Private":"Public"}</div>
            </div>})}
    </div>
    </>
}

export default GroupList