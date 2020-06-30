

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const withRouter = window.ReactRouterDOM.withRouter;


class App extends React.Component{
    render(){
        return(
        <div>
            <Router>
                <div className = "App">
                <Switch>
                    <Route  path="/signup" exact component={Signup}/>
                    <Route  path="/" key = "render" exact component={Login}/>
                    <Route  path="/listings"  key = "render" exact render={()=><Listing/>}/> 
                    <Route  path="/new-listing" exact component={NewListing}/>
                    <Route  path = "/logout" exact component = {Logout}/>
                    <Route  path = "/order" exact component = {Order}/>
                    <Route  path = "/your-listings" exact  component={YourListing}/> 
                </Switch>
                </div>
            </Router>
        </div>  
        
        );
    }
}


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
            console.log("I am redirecting you from login component")
            return(
            <Redirect key ="render" to="/listings"/>
            )
        }

        else{
            return(
                
                <div  id="login"
                style={{backgroundImage: "url(" + " /static/images/green.jpg" + ")",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'}}> 
            

                <div className="modal-dialog text-center">
                    <div className="col-sm-8 main-section">
                        <div className="modal-content">
                        <h1 class="logo">HomNom</h1>

                        <form className="col-12">
                                    <div className="form-group login">
                                        <input type="email" className="form-control"  name="email" value= {this.state.email} onChange={this.handleemail} aria-describedby="emailHelp" placeholder="Enter email"/> 
                                    </div>

                                    <div className="form-group login">
                                        <input type="password" className="form-control" id="exampleInputPassword1" name="password" value= {this.state.password} onChange={this.handlepassword}placeholder="Password"/>
                                    </div>

                                    
                                    <button type="submit" className="btn " onClick={this.handlesubmit}>
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
                </div>   
                    
            </div>
                           
                
            );
        }
    }
    
}

 
                  


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
            console.log(data_)
            console.log(this.state)
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
                            <label for="inputPassword4">Password</label>
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



class NewListing extends React.Component{
    constructor(){
        super();
        this.state = {
                    listing_name : "",
                    serves:"",
                    category:"Home Cooked",
                    description:"",
                    listing_address: "",
                    city:"San Francisco",
                    zipcode:"",
                    date:"",
                    time_from:"",
                    time_to:"",
                    cities:[],
                    categories:[]};
    
        this.handlename= this.handlename.bind(this);
        this.handleserves= this.handleserves.bind(this);
        this.handlecategory = this.handlecategory.bind(this);
        this.handleaddress = this.handleaddress.bind(this);
        this.handlecity= this.handlecity.bind(this);
        this.handledescription = this.handledescription.bind(this);
        this.handletimefrom = this.handletimefrom.bind(this);
        this.handletimeto = this.handletimeto.bind(this);
        this.handledate = this.handledate.bind(this);
        this.handlezipcode = this.handlezipcode.bind(this);
        this.handlesubmit = this.handlesubmit.bind(this);
        
    }

    handlename(evt){
        this.setState({listing_name:evt.target.value});
    }
    
    handleserves(evt){
            this.setState({serves:evt.target.value});
    }
    
    handleaddress(evt){
            this.setState({listing_address:evt.target.value});
    }

    handlecity(evt){
        this.setState({city:evt.target.value});
    }

    handlezipcode(evt){
        this.setState({zipcode:evt.target.value});
    }


    handlecategory(evt){
        this.setState({category:evt.target.value});
    }

    handledescription(evt){
        this.setState({description:evt.target.value});
    }

    handledate(evt){
        this.setState({date:evt.target.value});
    }

    handletimefrom(evt){
        this.setState({time_from:evt.target.value});
    }

    handletimeto(evt){
        this.setState({time_to:evt.target.value});
    }


    componentDidMount(){
        
        fetch('/categories')
        .then(function(response){
            return response.json()
        })
    
        .then(data_ => { 
            this.setState({categories:data_,})
            fetch('/cities')
            .then(function(res){
                return res.json()
            })
        
            .then(data_c => { 
                this.setState({cities:data_c,})
                
            })
           
        })    
    }


  


    handlesubmit(evt){
        evt.preventDefault();
        console.log(this.state);
        let time_from_int = parseInt(this.state.time_from)
        console.log(time_from_int)
        if ( isNaN(time_from_int)){
            
            alert("Invalid time from entered")
            return
        }
        let time_to_int = parseInt(this.state.time_to)
        if (isNaN(time_to_int)){
            alert("Invalid time to entered")
            return
        }
        if (time_from_int >= time_to_int){
            alert ("Invalid pickup window")
            return
        }
        fetch('/new-listing', 
           {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({user_id : localStorage.getItem("user_id"),
            listing_name : this.state.listing_name,
            serves:this.state.serves,
            category:this.state.category,
            description:this.state.description,
            listing_address:this.state.listing_address,
            city:this.state.city,
            zipcode : this.state.zipcode,
            date:this.state.date,
            time_from:this.state.time_from,
            time_to:this.state.time_to   
            })
            }
        )
    
        .then(function(res){
            return res.json()    
        })

        .then(data => { 
            
            alert(data)
            
        }) 
        
        
    }

    render(){
        const categories = this.state.categories
        const cities = this.state.cities
        return (
                <div className="new_listing" id="new_listing" key= "new_listing">  
            
                    <h1 id="new_listing">Upload a Listing</h1>
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
                                        <Link to="/listings" className="nav-link" value= "new-listing"> Go back to Browsing</Link>
                                    </li>

                                    <li key="orders" className="nav-item active">
                                    <Link to="/order" className="nav-link" type="submit" href= "/order" value = "see-orders" > Orders </Link>  
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/your-listings" className="nav-link" type="submit" value = "see-listings" > Listings </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active">
                                        <Link to="/logout" className="nav-link" > Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>


                    <form>
                    <div className="form-row">
                    <div className="form-group col-md-5">
                        <label>Listing Name</label>
                        <input type="text" className="form-control" id="inputlisting" value= {this.state.listing_name} onChange={this.handlename} placeholder="Chicken/ Rice/ Curry "/>
                    </div>

                        <div className="form-group col-md-5">
                            <label>Listing Category</label>
                                <select className="form-control" id="inputcity" onClick={this.handlecategory}>
                                    {categories.map(c =>(
                                    <option key={c["category_id"]} value={c["category_name"]}>{c["category_name"]}</option>))}
                                </select>
                        </div>

                        <div className="form-group col-md-2">
                        <label >Serves</label>
                        <input type="text" className="form-control" id="serves" value= {this.state.serves} onChange={this.handleserves} placeholder="2"/>
                    </div>

                    </div>

                    <div className="form-group">
                        <label>Listing Description</label>
                        <input type="text" className="form-control" id="inputAddress" value= {this.state.description} onChange={this.handledescription} />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" id="inputAddress" value= {this.state.listing_address} onChange={this.handleaddress}  placeholder="1234 Main St"/>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>City</label>
                                <select className="form-control" onClick={this.handlecity} >
                                    {cities.map(city =>(
                                    <option  key={city["city_id"]} value={city["city_name"]}>{city["city_name"]}</option>))}
                                </select>
                        </div>

                        
                        <div className="form-group col-md-2">
                        <label>Zip</label>
                        <input type="text" className="form-control" id="inputZip" value= {this.state.zipcode} onChange={this.handlezipcode}/>
                        </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group col-md-4">
                        <label>Available On</label>
                        <input type="text" className="form-control" id="inputlisting" value= {this.state.date} onChange={this.handledate}  placeholder="YYYY-MM-DD"/>
                    </div>

                        <div className="form-group col-md-4">
                            <label>Available from</label>
                            <input type="text" className="form-control" id="itime"  value= {this.state.time_from} onChange={this.handletimefrom}placeholder="HH:MM"/>
                        </div>

                        <div className="form-group col-md-4">
                            <label>Available till</label>
                            <input type="text" className="form-control" id="itime" value= {this.state.time_to} onChange={this.handletimeto} placeholder="HH:MM"/>
                        </div>

                    </div>

                    
                    <button type="submit" className="btn btn-primary" onClick={this.handlesubmit}>Post my listing</button>
                    </form>

                </div>
        );
    }
}


class Listing extends React.Component{
    googleMapRef = React.createRef()
    
    constructor(props){
        super(props);
        const token = localStorage.getItem("token")
        let loggedIn = true
        if(token == null){
            loggedIn = false
        }


        this.state = {listings: [],
                    qty:1,
                    current_location:"",
                    add : [],
                    mapLoaded: false,
                    loggedIn,
                    
                    }
                   
        this.handleqty=this.handleqty.bind(this);  
        
    }


   

    handleqty(e){
        this.setState({qty:e.target.value},  
            );
    }


  

    componentDidMount(){
        console.log("I am within listing")
        
        fetch('/all-listings',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                
              })
          
        })

        .then(function(res){
            return res.json()
        })

        .then(data => { 
            this.setState({listings:data});
            
            fetch('/all-addresses',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
               
            } 
            )
        
            .then(function(res){
                return res.json()
            })
    
            .then(data => { 
                this.setState({add:data,}) 
            }) 
        })   
        .catch(err => console.log(err));  

        console.log("loading google map script")
        const googleMapScript = document.createElement('script')
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_A07jL5otsFc8gDAvgZgcbHugwh9xO18&libraries=places`
        
        
        window.document.body.appendChild(googleMapScript)


        googleMapScript.addEventListener("load", () => { 
            if (this.state.mapLoaded == true) {
                return;
            }
        
        this.googleMap = this.createGoogleMap()
        

        this.info = this.infowindow()
        this.setState({mapLoaded: true})
        
        });     
    }
    
    

  

    createGoogleMap = () => 
      
      new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 10,
        center: {
          lat:  37.7749504  ,
          lng:  -122.4507392,
        },
        
        controlSize: 20,
       
      })


    infowindow =() =>
     new google.maps.InfoWindow({
        content:"Hello World!"
      });
    
  
    createMarker = (l1,l2) => 
        new window.google.maps.Marker({
        position: {lat: parseFloat(l1), lng: parseFloat(l2)},
        map: this.googleMap,
      });
   
    
    
    placeMarkers=(information)=> {
      
        for (const a of this.state.add){
        const marker = this.createMarker(a.lat, a.lng)
        
        marker.addListener('click', function() {
            information.setContent(`
            <div id = "pins">
                <p>
                    <b> ${a.name} </b>
                    <br>
                    Serves = ${a.serves} 
                    <br>
                    Pickup = ${a.time_from.slice(0,-3)}- ${a.time_to.slice(0,-3)} on ${a.listing_date}
                </p>
            </div>
            `)
            information.open(this.googleMap, marker);
          });
        }
    }
  



    handlepickup(listing){
        if (this.state.qty > listing.serves){
            
            alert("Not enough food, try with a lower quantity")
            return
        }
        
        listing.serves = listing.serves - this.state.qty
        this.setState({serves:listing.serves})
        
        fetch('/update-listing', 
        {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({listing_id:listing.listing_id,
            qty:this.state.qty,
            user_id: localStorage.getItem("user_id")
            })
        
        })

        .then(function(res){
            return res.json()
         })

        .then(data_ => { 
        if (data_ === "Order Placed"){
            localStorage.setItem("listing_id", listing["listing_id"])
            
            alert(data_)

            fetch('/place-order', 
                {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({user_id: localStorage.getItem("user_id"),
                order_qty:this.state.qty,
                listing_id: localStorage.getItem("listing_id"),
                
                })
            }
            )
   
            .then(function(res){
                return res.json()      
            })

            .then(data => { 
                localStorage.removeItem("listing_id")
                console.log(data)}) 
                return
            }

            alert(data_)
            
        }) 
    }


    render(){
        if (this.state.mapLoaded && this.state.add){
            
             this.placeMarkers(this.info)}

        if (this.state.loggedIn === false){
            return (<Redirect key = "render" to ="/"/>)
        }

        else{
            return (
                <div  id= "all_listings"  className= "container" style={{backgroundImage: "url(" + " /static/images/marble.jpeg" + ")",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'}}>  

                    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top" style={{color:"green"}}>
                      <div className= "container-fluid" id="listings_buttons">
                        <Link to="/listings" className= "navbar-brand">HN</Link>

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li key= "for" className="nav-item active">
                                
                                    <select className="form-control" id = "qty" onChange={this.handleqty}>
                                        <option key ="1" value="1">1</option>
                                        <option key ="2" value="2">2</option>
                                        <option key ="3" value="3">3</option>
                                        <option key ="4" value="4">4</option>
                                    </select>

                                </li>
                                <li key= "ul" className="nav-item active">
                                    <Link to="/new-listing" className="nav-link" value= "new-listing"> Upload Listing </Link>
                                </li>

                                <li key="orders" className="nav-item active">
                                    <Link to="/order" className="nav-link" type="submit" href= "/order" value = "see-orders" > Orders </Link>  
                                </li>

                                <li key="listings" className="nav-item active">
                                    <Link to="/your-listings" className="nav-link" type="submit" value = "see-listings" > Listings </Link>  
                                </li>

                                <li key="logout" className="nav-item active">
                                    <Link to="/logout" className="nav-link" > Log Out </Link>
                                </li>
                            </ul>
                        </div>

                     
                      </div>
                    </nav>


                    
                                            
                    
                  

                    
                    <div className="container my-container" id="show_listings" key="render_listings" >
                        <p id="response" key = "1"></p>
                            <div className="row">
                            <div 
                            className=" col-lg-12 col-md-8 my-map sticky-top"
                            key="render_map"
                            id="google-map"
                            ref={this.googleMapRef}
                            style={{ width: '100%', height: '300px'}}
                            >
                            </div>
                            </div>
                        {this.state.listings.map((listing,index) => (
                    
                            <div className="row my-row" id = "each-listing" key = {listing.listing_id} >
                                
                                <div className="col-lg-12 col-md-8 my-col" key= {listing.listing_id}>
                                <br></br>
                                <br></br>
                                <b>{listing.name}</b><br></br>
                                Listing Id : {listing.listing_id}<br></br>
                                Posted By : {listing.user}<br></br>
                                Category : {listing.category}<br></br>
                                Description : {listing.description}<br></br>
                                Serves: {listing.serves}<br></br>
                                Address: {listing.address}, {listing.city}<br></br>
                                Pickup Window : {listing.time_from.slice(0,-3)} - {listing.time_to.slice(0,-3)} on {listing.listing_date}
                                <button className="btn pickup " type="submit" value="order" onClick={this.handlepickup.bind(this,listing)}> Request pickup</button>
                                </div>
                                
                                
                            </div>
                    )   
                    )}
                    </div>
                    
                </div>
            )
        }
    }
}
    


class Logout extends React.Component {
    constructor(){
        super();
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
    }
    render() {
        return (
            <div  id="logout"
            style={{backgroundImage: "url(" + " /static/images/green.jpg" + ")",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'}}> 
        

            <div className="modal-dialog text-center">
                <div className="col-sm-8 main-section">
                    <div className="modal-content">
                    <h1 id="logout">You are logged out</h1>

                    <form className="col-12">
                                
                                <Link to="/">
                                <button type="submit" className="btn ">
                                    Login Again
                                </button>
                                </Link>

                        </form>


                        <div className="col-12 loginagain">
                        
                        </div>


                    </div>  
                </div>
            </div>   
                
        </div>
        )
    }
}
 


class Order extends React.Component{
    constructor(props){
        super(props);
        this.state=({orders:[]}) 
    }


    componentDidMount (){
        fetch('/your-orders',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({user_id:localStorage.getItem("user_id")   
            })
        } 
        )
    
        .then(function(res){
            return res.json()
        })

        .then(data => { 
            this.setState({orders:data,})
            
        }) 
    }


    render(){
       
        return(
        <div className= "user_orders" id="user_orders" key="user_orders">
            <h1 id = "new_listing"> Your Orders</h1>

            <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top" >
                      <div className= "container-fluid" id="go_back">

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li key= "ul" className="nav-item active">
                                        <Link to="/listings" className="nav-link" value= "new-listing"> Go back to Browsing</Link>
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/your-listings" className="nav-link" type="submit" value = "see-listings" > Listings </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active">
                                        <Link to="/logout" className="nav-link" > Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>
           
            {this.state.orders.map((order) => (
        
                    <div id = "each_user_order" key = {order.order_id} className="listing">
                        <ul>
                            <li key= {order.order_id}>
                            <br></br>
                            <br></br>
                            order id: {order.order_id}<br></br>
                            listing: {order.listing_name}<br></br>
                            address: {order.listing_address}<br></br>
                            pickup time : {order.listing_time_from} - {order.listing_time_to} on {order.listing_date}
                            </li>
                        </ul>
                    </div>
            )   
            )}
        </div>
        )
    }
}




class YourListing extends React.Component{
    constructor(props){
        super(props);
        this.state=({your_listing:[],
        update_serves: 0})

    this.handleupdateserves = this.handleupdateserves.bind(this)
    this.serveDropdownFn =   (int_serves) =>{
        const list_servings = []
        for (let i = 0; i < parseInt(int_serves); i++){
            const a = i.toString()
             list_servings.push( <option key ={a} value={a}>{i}</option> )
            }   
    
         return list_servings; 
    }
    }

    componentDidMount (){
        
    
        fetch('/your-listings',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({user_id:localStorage.getItem("user_id")   
            })
        } 
        )

        .then(function(res){
            return res.json()
        })

        .then(data => { 
            this.setState({your_listing:data})
            
        }) 
       

    }

    handleupdateserves(e){
        this.setState({update_serves:e.target.value},
            console.log(this.state)
             
            );
    }
    
    handleupdate(listing){
        fetch('/lister-updates', 
        {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({listing_id:listing.listing_id,
            update_serves:this.state.update_serves
            })
        
        })

        .then(function(res){
            return res.json()
         })  

        .then(data => { 
            console.log(data)
            alert(data)
            
        }) 
         
    }

    
    render(){
    
        return(
                <div id="user_listings">
                    <h1 id = "new_listing"> Your Orders</h1>
                    


                    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top" >
                      <div className= "container-fluid" id="go_back">

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li key= "ul" className="nav-item active">
                                        <Link to="/listings" className="nav-link" value= "new-listing"> Go back to Browsing</Link>
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/order" className="nav-link" type="submit" value = "see-listings" > Orders </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active">
                                        <Link to="/logout" className="nav-link" > Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>
           


                    {this.state.your_listing.map((listing) => (
                        <div id= "each_user_listing" key = {listing.listing_id} className="listing">
                         
                            <ul>
                                <li key= {listing.listing_id}>
                                    <b>{listing.name}</b><br></br>
                                    Listing Id : {listing.listing_id}<br></br>
                                    Category : {listing.category}<br></br>
                                    Description : {listing.description}<br></br>
                                    Serves:{listing.serves}<br></br>
                                    Address: {listing.address}, {listing.city}<br></br>
                                    Pickup Window : {listing.time_from} - {listing.time_to} on {listing.listing_date}<br></br>

                                    
                                    <label>Update Serves</label>
                                    <select className="form-control" onChange={this.handleupdateserves}>
                                    {this.serveDropdownFn(listing.serves)}
                                    
                                                
                        )}
                    ))
                                    </select>
                                    <button className="btn" type="submit" value="order" onClick={this.handleupdate.bind(this,listing)}> Update</button>
                                    
                                </li>
                            </ul>
            
                        </div>
                    )            
                    )}
                </div>
        )
    }   
}



ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );


 
  














