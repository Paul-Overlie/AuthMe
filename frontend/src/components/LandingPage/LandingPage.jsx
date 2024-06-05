import { Link } from "react-router-dom"
import { useSelector } from "react-redux"


const LandingPage = () => {
    const user = useSelector(state => state.session.user)
    // console.log(user)
    return <>
    <div>
        <div>
            <div>
                Meetup
            </div>
            <div>
                intro text inserted here
            </div>
        </div>
    <img src="https://i.pinimg.com/736x/07/d9/d6/07d9d6acf5eeb6a1019de2b523577522.jpg" />
    </div>
    <div>
        <div>Subtitles right here</div>
        <div>caption?</div>
    </div>
    <div>
        <div>icon, link, and caption <Link to={"/groups"}>See all groups</Link></div>
        <div><Link to={"/events"}>Find an event</Link></div>
        <div>{user?<Link to={"/groups/new"}>Start a group</Link>:<div>Start a group</div>}</div>
    </div>
    <div><button>Join Meetup</button></div>
    </>
}

export default LandingPage