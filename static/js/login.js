import React from 'react';



function login() {
    return (
                  <div>
                      <h1>Login Page</h1>
                  <form id = "sign-in">
                <label>Email</label>
                <input type= "text" name="email"></input>
    
                <label>Password</label>
                <input type= "text" name="password"></input>
                </form>
                </div>)
}

export default login;