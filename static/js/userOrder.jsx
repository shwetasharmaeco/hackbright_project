


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
           

            <nav className="navbar navbar-expand-md navbar-dark sticky-top" style = {{backgroundColor: "#e2bd19"}}  >
                      <div className= "container-fluid" id="go_back">

                      <Link className="navbar-brand" style={{color:"black", fontWeight:"bold"}}>
                            Your Orders</Link>

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
                                        <Link to="/your-listings" className="nav-link" type="submit" value = "see-listings"style={{color:"black"}} > Listings </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active">
                                        <Link to="/logout" className="nav-link" style={{color:"black"}}> Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>
           
            {this.state.orders.map((order) => (
        
                    <div id = "each_user_order" key = {order.order_id} className="listing">
                        <ul>
                            <li key= {order.order_id} style={{textAlign:'center', borderBottom:"1px solid black"}}>
                            Order Id: {order.order_id}<br></br>
                            Listing: {order.listing_name}<br></br>
                            Address: {order.listing_address}<br></br>
                            Pickup Window : {order.listing_time_from} - {order.listing_time_to} on {order.listing_date}
                            
                            </li>
                        </ul>
                    </div>
            )   
            )}
        </div>
        )
    }
}

