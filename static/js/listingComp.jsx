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
    


 
