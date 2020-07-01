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


