import { useState } from "react"
import { createGroup } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export const CreateGroup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    let theState = useSelector(state => state.groups?.madeGroup)
    let errors = useSelector(state => state.groups?.groupErrs?.errors)

    let [location, setLocation] = useState("")
    let [name, setName] = useState("")
    let [about, setAbout] = useState("")
    let [online, setOnline] = useState("In Person")
    let [publicity, setPublicity] = useState(true)
    let [image, setImage] = useState("")

    let onSubmit = async (e) => {
        e.preventDefault()
        let [city, state] = location.split(", ")
        let response = await dispatch(createGroup({
            name, about, type:online, private:publicity, city, state, image
        }))
        if(response) {
            if(Object.values(response).length>0){navigate('/groups/'+theState?.id)}
        }
    }
    


    return <form onSubmit={(e)=>{onSubmit(e)}}>
        <div>Start a new group</div>
        <div className="createGroup1">
            <div>{"Set your group's location"}</div>
            <div>{"Meetup groups meet locally, in person, and online. We'll connect you with people in your area."}</div>
            <input type="text" placeholder="City, STATE" 
            value={location}
            onChange={(e)=>setLocation(e.target.value)}/>
        </div>
        {errors?.city ? <div>{errors.city}</div> : null}
        {errors?.state ? <div>{errors.state}</div> : null}
        <div className="createGroup2">
            <div>{"What will your group's name be?"}</div>
            <div>{`Chose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.`}</div>
            <input type="text" placeholder="What is your group name?"
            value={name}
            onChange={(e)=>setName(e.target.value)}/>
        </div>
        {errors?.name ? <div>{errors.name}</div> : null}
        <div className="createGroup3">
            <div>Describe the purpose of your group.</div>
            <div>{`People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?`}</div>
            <textarea placeholder="Please write at least 30 characters." 
            value={about}
            onChange={(e)=>setAbout(e.target.value)}/>
        </div>
        {errors?.about ? <div>{errors.about}</div> : null}
        <div className="createGroup4">
            <label>Is this an in-person or online group?
                <select value={online} onChange={(e)=>setOnline(e.target.value)}>
                    <option>In Person</option>
                    <option>Online</option>
                </select>
            </label>
            <label>Is this group private or public?
                <select value={publicity} onChange={(e)=>setPublicity(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
            </label>
            <label>Please add an image URL for your group below.
                <input type="text" placeholder="Image Url"
                value={image}
                onChange={(e)=>setImage(e.target.value)}/>
            </label>
        </div>
        <button>Create Group</button>
    </form>
}