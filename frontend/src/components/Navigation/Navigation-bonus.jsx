import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='NavContainer'>
      <li className='NavHomeIcon'>
        <NavLink to="/"><img src="/favicon.ico" /></NavLink>
      </li>
      {isLoaded && (
        <li className='NavProfileButton'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
