



class Login extends React.Component{
    constructor(){
        super();
        const token = localStorage.getItem("token")
        let loggedIn = true
        if(token == null){
            loggedIn = false
        }
        this.state = {email : "",
                    password : "",
                    loggedIn};
    
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
        }
        )
        .then(data => { 
            if ("error" in data){
                alert(data["error"])
                return
            }

        
            if (data["user_id"]){
                localStorage.setItem("token", "shweta")
                localStorage.setItem("user_id", data["user_id"] )
                this.setState({loggedIn:true})    
            }

            else{   
                alert("Something went wrong")
            }
        });
    }   

 
    
    render(){
        const loggedIn = this.state.loggedIn
        if (loggedIn){
            return(
            <Redirect key ="render" to="/listings"/>
            )
        }

        else{
            return(
                
                <div  id="login">
                <h1 style={{ fontSize: '150%', fontFamily: 'Quicksand'}}>"Why waste it when someone can taste it..."</h1>
                    <div className="col-sm-8 col-lg-4 main-section m-4 m-lg-0">
                       
                        <div className="logo"><i class="fa fa-home" aria-hidden="true"></i>HomNom</div>

                        <form className="login-form shadow col-12">
                            <div className="form-group login">
                                <input type="email" className="form-control"  name="email" value= {this.state.email} onChange={this.handleemail} aria-describedby="emailHelp" placeholder="Enter email" style={{border: '1px solid #e2bd19'}}/> 
                            </div>

                            <div className="form-group login">
                                <input type="password" className="form-control" id="exampleInputPassword1" name="password" value= {this.state.password} onChange={this.handlepassword} placeholder="Password" style={{border: '1px solid #e2bd19'}}/>
                            </div>
                            
                            <button type="submit" className="btn " onClick={this.handlesubmit} style={{fontFamily: 'PT Serif'}}>
                                Login
                            </button>
                        </form>


                        <div className="col-12 forgot">
                            <Link to="/signup">
                                New User?
                            </Link>
                        </div>


                        
                    </div>
                
                    
                </div>   
            );
        }
    }
    
}