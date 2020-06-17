

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
                    <Route exact strict path="/"   component={Login}/>
                    <Route exact strict path="/signup" component={Signup}/>
                    <Route exact strict path="/listings" component={Listing}/> 
                    <Route exact strict path="/new-listing" component={NewListing}/>
                    <Route exact strict path = "/logout" component = {Logout}/>
                    <Route exact strict path = "/order" component = {Order}/>
                    <Route exact strict path = "/your-listings" component={YourListing}/> 
                    <Route exact strict path ="/map" component={GoogleMap}/> 
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
        }
        )
        .then(data => { 
            if ("error" in data){
                document.getElementById("response").innerHTML = data["error"]
                return
        }

        
            if (data["user_id"]){
                localStorage.setItem("token", "shweta")
                localStorage.setItem("user_id", data["user_id"] )
                this.setState({loggedIn:true})
                document.getElementById("response").innerHTML = "Logged In" 
            }
            else{
                document.getElementById("response").innerHTML = "Something went wrong"
            }
        });

    }   

 
    
    render(){
        const loggedIn = this.state.loggedIn
        if (loggedIn){
            return(<div>
            <Redirect to="/listings"/>
            </div>)
        }

        else{
            return(
        
                <div>    
                    <h1>Login Page</h1>
                    <p id="response"> </p>
                        <form id = "sign-in">
                            <input type= "text" placeholder = "Email" name="email" value= {this.state.email} onChange={this.handleemail}></input>
                            <br></br>
                            <br></br>
                            <input type= "text" placeholder = "password" name="password" value= {this.state.password} onChange={this.handlepassword}></input>
                            <button type="submit" form="login" value="Submit" onClick={this.handlesubmit}>Submit</button>
                        </form>
                        <br></br>
                        <br></br>
                        <Link to="/signup">
                            <button type="submit" value= "in">Create Account</button>
                        </Link>
                    <br></br>
                    <br></br>       
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
        console.log(data)
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
                <div>  
            
                    <h1>Create an Account</h1>
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
                                <select className="city" onClick={this.handlecity}>
                                    {cities.map(c =>(
                                    <option key={c["city_name"]} value={c["city_name"]}>{c["city_name"]}</option>))}
                                </select>

                                <br></br>
                                <br></br> 

                                <label>Email</label>
                                <input type="text" name="email" value= {this.state.email} onChange={this.handleemail}></input>
                                <br></br>
                                <br></br>

                                <label>Password</label>
                                <input type="text" name="password" value= {this.state.password} onChange={this.handlepassword}></input>
                                <br></br>
                                <br></br>
                                <button type="submit" form="signup" value="Submit" onClick={this.handlesubmit}>Submit</button>

                        </form>
                        <br></br>
                        <br></br>

                        <Link to="/">
                            <button type="submit" value= "in">Go Back</button>
                        </Link>
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
                    category:"",
                    description:"",
                    listing_address: "",
                    city:"",
                    zipcode:"",
                    date:"",
                    time_from:"",
                    time_to:"",
                    categories:[]};
    
        this.handlename= this.handlename.bind(this);
        this.handleserves= this.handleserves.bind(this);
        this.handlecategory = this.handlecategory.bind(this);
        this.handleaddress = this.handleaddress.bind(this);
        this.handlecity= this.handlecity.bind(this);
        // this.handleemail= this.handleemail.bind(this);
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


    // handleemail(evt){
    //     this.setState({lister_email:evt.target.value});
    // }

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
            console.log(data_)
            console.log(this.state)
        })    
    }


  


    handlesubmit(evt){
        evt.preventDefault();
        console.log(this.state);

     
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
            document.getElementById("response").innerHTML = data
            console.log(data)
        }) 
        
        
    }

    render(){
        const categories = this.state.categories
        const cities = localStorage.getItem("cities")
        return (
                <div>  
            
                    <h1>Upload a Listing</h1>
                    <p id="response"></p>

                        <Link to="/listings">
                            <button type="submit" value= "Logout">Go back to Browsing</button>
                        </Link>
                        <br></br>
                        <br></br>
                            <form id= "new-listing">
                        
                                    {/* <label>Email</label>
                                    <input type= "text" name="email" value= {this.state.lister_email} onChange={this.handleemail}></input>
                                    <br></br>
                                    <br></br> */}

                        
                                    <label>Listing Name</label>
                                    <input type="text" name="listing_name" value= {this.state.listing_name} onChange={this.handlename}></input>
                                    <br></br>
                                    <br></br>

                                    <label>Serves</label>
                                    <input type= "text" name="serves" value= {this.state.serves} onChange={this.handleserves}></input>
                                    <br></br>
                                    <br></br>
                        
                                    <label>Address</label>
                                    <input type="text" name="address" value= {this.state.listing_address} onChange={this.handleaddress}></input>
                                    <br></br>
                                    <br></br>
                        
                                    <label>City</label>
                                    <input type="text" name="city" value= {this.state.city} onChange={this.handlecity}></input>
                                    <br></br>
                                    <br></br>

                                    <label>Zipcode</label>
                                    <input type="text" name="zipcode" value= {this.state.zipcode} onChange={this.handlezipcode}></input>
                                    <br></br>
                                    <br></br>


                                    {/* <label>City</label>
                                        <select className="city" onClick={this.handlecity}>
                                        {cities.map(c =>(
                                        <option key={c["city_name"]} value={c["city_name"]}>{c["city_name"]}</option>))}
                                        </select> */}
    
                                    <label>Listing description</label>
                                    <input type="text" name="description" value= {this.state.description} onChange={this.handledescription}></input>
                                    <br></br>
                                    <br></br>
                        
                                    <label>Listing Category</label>
                                    <select className="category" onClick={this.handlecategory}>
                                        {categories.map(c =>(
                                        <option key={c["category_name"]} value={c["category_name"]}>{c["category_name"]}</option>))}
                                    </select>
                                    {/* <input type="text" name="category" value= {this.state.category} onChange={this.handlecategory}></input>*/}
                                    <br></br>
                                    <br></br> 

                                    <label>Available On</label>
                                    <input type="text" name="date" placeholder="YYYY-MM-DD" value= {this.state.date} onChange={this.handledate}></input>
                                    <br></br>
                                    <br></br>

                                    <label>Available From</label>
                                    <input type="text" name="time_from" value= {this.state.time_from} onChange={this.handletimefrom}></input>
                                    <br></br>
                                    <br></br>

                                    <label>Available till</label>
                                    <input type="text" name="time_to" value= {this.state.time_to} onChange={this.handletimeto}></input>
                                    <br></br>
                                    <br></br>
                                    <button type="submit" form="newlisting" value="Submit" onClick={this.handlesubmit}>Submit</button>
                            </form>
                </div>
        );
    }
}



class Listing extends React.Component{
    constructor(props){
        super(props);
        const token = localStorage.getItem("token")
        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            loggedIn
        }

        this.state = {listings: [],
                    qty:1,
                    current_location:""
                    }
                   
        this.handleqty=this.handleqty.bind(this);  
        this.handlecurrentlocation= this.handlecurrentlocation.bind(this)
    }


    handleqty(e){
        this.setState({qty:e.target.value},  
            );
    }

    handlecurrentlocation(e){
        this.setState({current_location:e.target.value},  
            );
    }
   

    componentDidMount(){
    
        fetch('/all-listings',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                current_location : this.state.current_location
              })
          
        })

        .then(function(res){
            return res.json()
        })

        .then(data => { 
            this.setState({listings:data})
        })         
    }

    handlepickup(listing){
        if (this.state.qty > listing.serves){
            document.getElementById("response").innerHTML = "Not enough food"
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
            qty:this.state.qty
            })
        
        })

        .then(function(res){
            return res.json()
         })

        .then(data_ => { 
        if (data_ === "Order Placed"){
            localStorage.setItem("listing_id", listing["listing_id"])
            document.getElementById("response").innerHTML = data_

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

            console.log(listing)
            console.log(data_)
            console.log(this.state)
            document.getElementById("response").innerHTML = data_
        }) 
    }


    render(){
        if (this.state.loggedIn === false){
            console.log(this.state.qty)
            return (<Redirect to ="/"/>)
        }

        else{
            return (
                <div>  
                    <label> Current Location </label>
                    <input type="text" name="dcurrent location" value= {this.state.current_location} onChange={this.handlecurrentlocation}></input>
                    <br></br>
                    <br></br>
                    <Link to="/new-listing">
                    <button type="submit" value= "new-listing">Upload new Listing</button>
                    </Link>
                        
                    <label>For</label>
                    <select onChange={this.handleqty}>
                        <option key ="1" value="1">1</option>
                        <option key ="2" value="2">2</option>
                        <option key ="3" value="3">3</option>
                        <option key ="4" value="4">4</option>
                    </select>

                    <Link to="/map">
                    <button type="submit" value = "map">Map</button>
                    </Link>
                        
                    <Link to="/order">
                    <button type="submit" value = "see-orders">Your Orders</button>
                    </Link>
                    <Link to="/your-listings">
                    <button type="submit" value = "see-listings">Your Listings</button>
                    </Link>  

                    <Link to="/logout">
                    <button type="submit" value= "Logout">Log Out</button>
                    </Link>
                    <p id="response"></p>
                    {this.state.listings.map((listing,index) => (
                
                        <div key = {listing.listing_id} className="listing">
                            <ul>
                            <li key= {listing.listing_id}>
                            <br></br>
                            <br></br>
                            listing_id : {listing.listing_id}<br></br>
                            user : {listing.user}<br></br>
                            listing: {listing.name}<br></br>
                            category : {listing.category}<br></br>
                            description : {listing.description}<br></br>
                            serves:{listing.serves}<br></br>
                            address: {listing.address}, {listing.city}<br></br>
                            pickup time : {listing.time_from} - {listing.time_to} on {listing.listing_date}
                            {/* <Link to="/Order"> */}
                            <button type="submit" value="order" onClick={this.handlepickup.bind(this,listing)}> Request pickup</button>
                            {/* </Link> */}
                            </li>
                            </ul>
                            
                        </div>
                    )   
                    )}
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
            <div>
                You are logged out.
                <br></br>
                <br></br>
                <Link to="/">
                    <button>Login Again
                    </button>
                </Link>
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
            console.log(data)
            console.log(this.state)
        }) 
    }


    render(){
        return(
        <div>
            <h1>Hi! this is order page</h1>
            <Link to="/listings">
                <button type="submit" value="to-listings">Go back to listings</button>
            </Link>
            {this.state.orders.map((order) => (
        
                    <div key = {order.listing_id} className="listing">
                        <ul>
                            <li key= {order.listing_id}>
                            <br></br>
                            <br></br>
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
        this.state=({your_listing:[]})
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
            this.setState({your_listing:data,})
            console.log(data)
            console.log(this.state)
        }) 

    }
    
    render(){
        
        return(
                <div>
                    <h1>Hi! this is Your listings page</h1>
                    <Link to="/listings">
                        <button type="submit" value="to-listings">Go back to listings</button>
                    </Link>
                    {this.state.your_listing.map((listing) => (
        
                        <div key = {listing.listing_id} className="listing">
                            <ul>
                                <li key= {listing.listing_id}>
                                <br></br>
                                <br></br>
                                    listing_id : {listing.listing_id}<br></br>
                                    listing: {listing.name}<br></br>
                                    category : {listing.category}<br></br>
                                    description : {listing.description}<br></br>
                                    serves:{listing.serves}<br></br>
                                    address: {listing.address}, {listing.city}<br></br>
                                    pickup time : {listing.time_from} - {listing.time_to} on {listing.listing_date}
                                </li>
                            </ul>
            
                        </div>
                    )            
                    )}
                </div>
        )
    }   
}




class GoogleMap extends React.Component {
    
    constructor(){
        super();
        this.state ={
            add : [],
            mapLoaded: false,

        }
    }

    googleMapRef = React.createRef()
    
    componentDidMount() { 
        console.log("*******",this.info)
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
            console.log(data)
            console.log(this.state)
        }) 

        const googleMapScript = document.createElement('script')
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_A07jL5otsFc8gDAvgZgcbHugwh9xO18&libraries=places`
        window.document.body.appendChild(googleMapScript)
  

        googleMapScript.addEventListener("load", () => { 
        this.googleMap = this.createGoogleMap()
        this.info = this.infowindow()
        console.log("!!!!!!!!",this.info)
        this.setState({mapLoaded: true})
     
      }); 
    }



  
    createGoogleMap = () => 
      
      new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 12,
        center: {
          lat:  37.7749504  ,
          lng:  -122.4507392,
        },
        disableDefaultUI: true,
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
            <div>
                <p>
                    <b> ${a.name} </b>
                    <br>
                    Serves = ${a.serves} 
                    <br>
                    Pickup = ${a.time_from}- ${a.time_to} on ${a.listing_date}
                </p>
            </div>
            `)
            information.open(this.googleMap, marker);
          });
        }
    }
  

    render() {
        
        if (this.state.mapLoaded && this.state.add){
            // console.log(this.info)
             this.placeMarkers(this.info)}
      
      return (
          <div>
        
        <div
          id="google-map"
          ref={this.googleMapRef}
          style={{ width: '800px', height: '800px' }}>
         
        
        </div>
        </div>
      )
    }
    
  
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );


 
  














