import React from 'react';
import './navbar.css';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/user';
import { Button, Dropdown } from 'react-bootstrap';

function Navbar() {
  const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logout());
        window.location.reload();
    }


  return (
    <div className='nav-container'>
        <header className='nav-header'>
            <h1>DigiDiary</h1>
            <nav className='nav-menu'>
                <ul className='nav-list'>
                    <li className='nav-list-item'>
                      <NavLink className='link-item' exact to="/">Home</NavLink>
                    </li>
                    <li className='nav-list-item'>
                      <NavLink className='link-item'  to="/diary">Diary</NavLink>
                    </li>
                    <li className='nav-list-item'>
                      <NavLink className='link-item'  to="/passwords">Passwords</NavLink>
                    </li>
                    <li className='nav-list-item'>
                      <NavLink className='link-item'  to="/expenses">Expenses</NavLink>
                    </li>
                </ul>
            </nav>
              {user.userId ? 
                <Dropdown>
                <Dropdown.Toggle variant="inactive" id="dropdown-basic">
                    {user.username} <span className="caret"></span>
                </Dropdown.Toggle>
    
                <Dropdown.Menu>
                    <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> : 
                <Button variant='primary'  >
              <NavLink className='link-item'  to="/loginpage">Login</NavLink>
              </Button> }
        </header>
    </div>
  )
}

export default Navbar;