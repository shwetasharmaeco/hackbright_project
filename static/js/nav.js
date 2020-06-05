import React from 'react';
const Link =  window.ReactRouterDOM.Link;

function nav(){
    return(
        <nav>
            <ul className="homepage-links">
            <Link to="/login">
                <li>
                    signin
                </li>
            </Link>
            <Link to="/signup">
                <li>
                    signup
                </li>
            </Link>
            </ul>

        </nav>
    );
}
export default nav;