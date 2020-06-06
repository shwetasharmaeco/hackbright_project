

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;



class App extends React.Component{
    render(){
        return(
            <div>
            <Router>
                <div className = "App">
                <Switch>
                    <Route path="/"  component={nav}/>
                </Switch>
                    <Route path="/signup" component={signup}/>
                    <Route path="/login" component={login}/>
                    
                </div>
            </Router>
            </div>  
        
        );
    }
}

const nav = () =>(

    
        <div>
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

        </div>
    );




class login extends React.Component{
    constructor(){
        super();
        this.state = {email : "",
                    password : ""};
    
    this.handleemail= this.handleemail.bind(this);
    this.handlepassword= this.handlepassword.bind(this);
    this.handlesubmit = this.handlesubmit.bind(this);
}
handleemail(evt){
    this.setState({email:evt.target.value});
}
handlepassword(evt){
    this.setState({password:evt.target.value});
}

handlesubmit(evt){
    evt.preventDefault();
    
    console.log(this.state);
 
    
     fetch('/sign-in', 
      {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({email:this.state.email,
        password:this.state.password})
    }
        )

    .then(function(res){
        return res.json()
           
    })
    .then(data => { 
        document.getElementById("response").innerHTML = data
        console.log(data)})    
}

 
    
    render(){
        
    return(
        
         <div>    
                <h1>Login Page</h1>
                <p id="response"> </p>
                    <form id = "sign-in">
                    <label>Email</label>
                    <input type= "text" name="email" value= {this.state.email} onChange={this.handleemail}></input>
                    <br></br>
                    <br></br>
                    <label>Password</label>
                    <input type= "text" name="password" value= {this.state.password} onChange={this.handlepassword}></input>
                    <button type="submit" form="login" value="Submit" onClick={this.handlesubmit}>Submit</button>
                    </form>
                <br></br>
                <br></br>
                
        </div>
        );
    }
    
}

class signup extends React.Component{
    constructor(){
        super();
        this.state = {name : "",
                    number : "",
                    address:"",
                    city:"",
                    email:"",
                    password : "",
                    };
    
    this.handlename= this.handlename.bind(this);
    this.handlenumber= this.handlenumber.bind(this);
    this.handleaddress = this.handleaddress.bind(this);
    this.handlecity= this.handlecity.bind(this);
    this.handleemail= this.handleemail.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    this.handlesubmit = this.handlesubmit.bind(this);
}

handlename(evt){
    this.setState({name:evt.target.value});
}

handlenumber(evt){
        this.setState({number:evt.target.value});
}

handleaddress(evt){
        this.setState({address:evt.target.value});
}
handlecity(evt){
    this.setState({city:evt.target.value});
}
handleemail(evt){
    this.setState({email:evt.target.value});
}
handlepassword(evt){
    this.setState({password:evt.target.value});
}
handlesubmit(evt){
    evt.preventDefault();
    
    console.log(this.state);
 
    
     fetch('/sign-up', 
      {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({name : this.state.name,
        number : this.state.number,
        address:this.state.address,
        city:this.state.city,
        email:this.state.email,
        password:this.state.password})
    }
        )

    .then(function(res){
        return res.json()
           
    })
    .then(data => { 
        document.getElementById("response").innerHTML = data
        console.log(data)})    
}

render(){
    return (
    <div>  
        
        <h1>"Create an Account"</h1>
        <p id="response"></p>
        
       <form id= "sign-up">

             <label>Name</label>
             <input type= "text" name="name" value= {this.state.name} onChange={this.handlename}></input>
             <br></br>
             <br></br>

             <label>Contact Number</label>
             <input type="text" name="number" value= {this.state.number} onChange={this.handlenumber}></input>
             <br></br>
             <br></br>

             <label>Address</label>
             <input type="text" name="address" value= {this.state.address} onChange={this.handleaddress}></input>
             <br></br>
            <br></br>

             <label>City</label>
             <input type="text" name="city" value= {this.state.city} onChange={this.handlecity}></input>
             <br></br>
            <br></br>

             <label>Email</label>
             <input type="text" name="email" value= {this.state.email} onChange={this.handleemail}></input>
             <br></br>
            <br></br>

             <label>Password</label>
             <input type="text" name="password" value= {this.state.password} onChange={this.handlepassword}></input>
         </form>
            <br></br>
            <br></br>
         <button type="submit" form="signup" value="Submit" onClick={this.handlesubmit}>Submit</button>
       </div>
       );
}
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );


 
  














