import React from 'react';
import style from './LoginStart.module.css';
// import { accessUrl } from './Login'
import BridgeWhiteMainLogo from './BridgeWhiteLOGO.png';
import { NavLink } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
// import {Link} from 'react-router-dom';


function LoginStart() {
    return (
        
        <div className={style.login}>
            <img src={BridgeWhiteMainLogo} 
            alt="MainBridgeLOGO"/>
            {/* <a href={accessUrl}>LOGIN TO BRIDGE</a> */}
            <NavLink exact activeClassName="active" to="/login">LOGIN TO BRIDGE</NavLink>
            {/* <button type="button" onClick={goLogin}>LOGIN TO BRIDGE</button> */}
            {/* <Link to="/3"></Link> */}
        </div>
        
    )
}

export default LoginStart;