


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
        console.log(this.state)
        
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
            time_to:this.state.time_to,
            listed:false  
            })
            }
        )
    
        .then(function(res){
            return res.json()    
        })

        .then(data => { 
            alert(data) 
            
            this.setState({listed:true})
            console.log(this.state)
           
        }) 
     
        
        
    }

    render(){
        if (this.state.listed==true){
            return(
                <Redirect  to="/listings"/>
                )
        }

        else{
        const categories = this.state.categories
        const cities = this.state.cities
        return (
                <div className="new_listing" id="new_listing" key= "new_listing" style={{minHeight: "100%"}}>  

                    <nav className="navbar navbar-expand-md navbar-dark sticky-top" style = {{backgroundColor: "#e2bd19"}}  >
                      <div className= "container-fluid" id="go_back">
                      <Link className="navbar-brand" style={{color:"black" ,fontWeight:"bold"}}> Upload a listing</Link>

                        <button className= "navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" value= "new-listing">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">

                                <ul className="navbar-nav ml-auto">
                                    <li key= "ul" className="nav-item active">
                                        <Link to="/listings" className="nav-link" value= "new-listing" style={{color:"black"}}> Go back to Browsing</Link>
                                    </li>

                                    <li key="orders" className="nav-item active">
                                    <Link to="/order" className="nav-link" type="submit" href= "/order" value = "see-orders"  style={{color:"black"}}> Orders </Link>  
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/your-listings" className="nav-link" type="submit" value = "see-listings" style={{color:"black"}}> Listings </Link>  
                                    </li>

                                    <li key="logout" className="nav-item active" >
                                        <Link to="/logout" className="nav-link" style={{color:"black"}} > Log Out </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>


                    <form className="container upload_listing_form">
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

                    <div ClassName= "row" style={{justifyContent:"center", display:"flex"}}>
                    <button type="submit" className="btn-primary btn-lg col-2" onClick={this.handlesubmit} style={{margin:"0.5rem", backgroundColor:"#e2bd19", border: "#e2bd19", color:"black"  }}>Post my listing</button>
                    </div>
                    </form>

                </div>
        
        );
        }
    }
}