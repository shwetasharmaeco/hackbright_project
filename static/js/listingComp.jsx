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
            return (<Redirect to ="/"/>)
        }

        else{
            return (
                <div style ={{width:"100%", height:"100%"}}>  
                    
                    <div
                    key="2"
                    id="google-map"
                    ref={this.googleMapRef}
                    style={{ width: '100%', height: '300px', position:"fixed" }}
                    >
                    </div>
                                            
                    
                    <div key = "3" className="all-buttons" style={{ top:"350px"}}>
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

                        
                            
                        <Link to="/order">
                        <button type="submit" value = "see-orders">Your Orders</button>
                        </Link>
                        <Link to="/your-listings">
                        <button type="submit" value = "see-listings">Your Listings</button>
                        </Link>  

                        <Link to="/logout">
                        <button type="submit" value= "Logout">Log Out</button>
                        </Link>
                    </div>

                    
                    <div className="aftermap" key="4" style={{top:"400px", }}>
                        <p id="response" key = "1"></p>
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
                                pickup time : {listing.time_from.slice(0,-3)} - {listing.time_to.slice(0,-3)} on {listing.listing_date}
                                <button type="submit" value="order" onClick={this.handlepickup.bind(this,listing)}> Request pickup</button>
                                </li>
                                </ul>
                                
                            </div>
                    )   
                    )}
                    </div>
                    
                </div>
            )
        }
    }
}






class Listing extends React.Component{

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

    render(){
        return("dbhjdhd")
    }
}
