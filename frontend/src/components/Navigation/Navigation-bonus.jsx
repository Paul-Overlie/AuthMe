import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (<>
    <div className='NavContainer'>
      <div className='NavHomeIcon'>
        <NavLink to="/"><img className="NavHomeIconImg" src="data:image/png;base64,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" /></NavLink>
      </div>
      {isLoaded && (
        <ProfileButton className='NavProfileButton' user={sessionUser} />
      )}
    </div>
    <div className='greyLine'></div>
      </>
    
  );
}

export default Navigation;
