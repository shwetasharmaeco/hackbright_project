


class Signup extends React.Component{
    constructor(){
        super();
        this.state = {name : "",
                    number : "",
                    address:"",
                    city:"",
                    email:"",
                    password : "",
                    signedUp: false,
                    cities:[]
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

    componentDidMount(){
        
        fetch('/cities')
        .then(function(response){
            return response.json()
        })

        .then(data_ => { 
            this.setState({cities:data_,})
        })     
    }


    handlesubmit(evt){
        evt.preventDefault();
        localStorage.setItem("address", `${this.state.address} ${this.state.city} CA`)


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
           
            alert(data)
            
            if (data === 'Account created! Please log in'){
                this.setState({signedUp: true})
            };
        } 
        )      
    }

    render(){
        const signedUp = this.state.signedUp
        if (signedUp){
            return (<Redirect to ="/"/>)
        }

        else{
            const cities = this.state.cities
            return (
                <div className="signup" id="signup">  
            
                    <h1 id="new_listing">Create an Account</h1>
                    <p id="response"></p>

                    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top" >
                      <div className= "container-fluid" id="go_back">

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li key= "ul" className="nav-item active">
                                        <Link to="/" className="nav-link" value= "new-listing"> Go back </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>


                    <form>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>Name</label>
                            <input type="text" className="form-control" id="inputlisting" value= {this.state.name} onChange={this.handlename}/>
                        </div>

                        <div className="form-group col-md-4">
                        <label >Contact Number</label>
                        <input type="text" className="form-control" id="phone" value= {this.state.number} onChange={this.handlenumber} />
                        </div>
                    </div>

                    
                    <div className="form-row">
                    <div className="form-group col-md-8">
                        <label>Address</label>
                        <input type="text" className="form-control" id="inputAddress" value= {this.state.address} onChange={this.handleaddress}  placeholder="1234 Main St"/>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>City</label>
                                <select className="form-control" onClick={this.handlecity} >
                                    {cities.map(city =>(
                                    <option  key={city["city_id"]} value={city["city_name"]}>{city["city_name"]}</option>))}
                                </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                            <label>Email</label>
                            <input type="email" className="form-control" value= {this.state.email} onChange={this.handleemail} placeholder="Email"/>
                            </div>

                            <div className="form-group col-md-6">
                            <label >Password</label>
                            <input type="password" className="form-control" id="inputPassword4" value= {this.state.password} onChange={this.handlepassword}  placeholder="Password"/>
                            </div>
                        </div>

                    </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" onClick={this.handlesubmit}>Submit</button>
                    </form>     
                </div>
            );
        }
    }
}

