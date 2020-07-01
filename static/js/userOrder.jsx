


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

