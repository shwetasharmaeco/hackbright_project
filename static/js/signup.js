import React from 'react';



function signup(){
    return (
    <div>  
        <h1>
            Signup Page
        </h1>
       <form id= "sign-up">

             <label>Name</label>
             <input type= "text" name="name"></input>
            
            
             <label>Contact Number</label>
             <input type="text" name="phone"></input>

             <label>Address</label>
             <input type="text" name="user-address"></input>

             <label>City</label>
             <input type="text" name="user-city"></input>

             <label>Email</label>
             <input type="text" name="email"></input>

             <label>Password</label>
             <input type="text" name="password"></input>
         </form>
       </div>)}

    export default signup;