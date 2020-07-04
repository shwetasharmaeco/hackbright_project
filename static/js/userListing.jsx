


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
                    <nav className="navbar navbar-expand-md navbar-dark sticky-top" style = {{backgroundColor: "#e2bd19"}} >
                      <div className= "container-fluid" id="go_back">

                      <Link className="navbar-brand" style={{color:"black", fontWeight:"bold"}}>
                            Your Listings</Link>

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li key= "ul" className="nav-item active">
                                        <Link to="/listings" className="nav-link" value= "new-listing" style={{color:"black"}}> Go back to Browsing</Link>
                                    </li>

                                    <li key="ul" className="nav-item active">
                                        <Link to="/new-listing" className="nav-link" value="new-listing" style={{color:"black"}}> Upload Listing </Link>
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/order" className="nav-link" type="submit" value = "see-listings" style={{color:"black"}}> Orders </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active">
                                        <Link to="/logout" className="nav-link" style={{color:"black"}} > Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>
           


                    {this.state.your_listing.map((listing) => (
                        <div id= "each_user_listing" key = {listing.listing_id} className="listing">
                         
                            <ul>
                                <li key= {listing.listing_id} style={{textAlign:'center', borderBottom:"1px solid black"}}>
                                    <b>{listing.name}</b><br></br>
                                    Listing Id : {listing.listing_id}<br></br>
                                    Category : {listing.category}<br></br>
                                    Description : {listing.description}<br></br>
                                    Serves:{listing.serves}<br></br>
                                    Address: {listing.address}, {listing.city}<br></br>
                                    Pickup Window : {listing.time_from} - {listing.time_to} on {listing.listing_date}<br></br>

                                    <div className="row" style={{justifyContent:"center"}}>
                                    <label className="col-1" style={{margin:"0.5rem", marginTop:'1rem', color:'#e2bd19', fontWeight:'bold'}}>Set Serves</label>
                                    
                                    <select className="form-control col-1" onChange={this.handleupdateserves} style={{margin:"0.5rem"}}>
                                    {this.serveDropdownFn(listing.serves)}               
                                )}
                                ))
                                    </select>
                                    <button className=" btn-secondary btn-sm col-1" type="submit" value="order" onClick={this.handleupdate.bind(this,listing)} style={{margin:"0.5rem", backgroundColor:"#e2bd19"}}> Update</button>
                                    </div>
                                </li>
                            </ul>
            
                        </div>
                    )            
                    )}
                </div>
        )
    }   
}


