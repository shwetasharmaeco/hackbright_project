


class Listing extends React.Component {
    googleMapRef = React.createRef()

    constructor(props) {
        super(props);
        const token = localStorage.getItem("token")
        let loggedIn = true
        if (token == null) {
            loggedIn = false
        }


        this.state = {
            listings: [],
            qty: 1,
            current_location: "",
            add: [],
            mapLoaded: false,
            loggedIn,

        }

        this.handleqty = this.handleqty.bind(this);

    }


    handleqty(e) {
        this.setState({ qty: e.target.value },
        );
    }


    componentDidMount() {
        fetch('/all-listings',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: localStorage.getItem("user_id")

                })
            })

            .then(function (res) {
                return res.json()
            })

            .then(data => {
                this.setState({ listings: data });
                localStorage.setItem("user_name", data[0]["curr_user"])


                fetch('/all-addresses',
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },

                    }
                )

                    .then(function (res) {
                        return res.json()
                    })

                    .then(data => {
                        this.setState({ add: data, })
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
            this.setState({ mapLoaded: true })

        });
    }

    createGoogleMap = () =>

        new window.google.maps.Map(this.googleMapRef.current, {
            zoom: 10,
            center: {
                lat: 37.7749504,
                lng: -122.4507392,
            },

            controlSize: 20,

        })


    infowindow = () =>
        new google.maps.InfoWindow({
            content: "Hello World!"
        });


    createMarker = (l1, l2) =>
        new window.google.maps.Marker({
            position: { lat: parseFloat(l1), lng: parseFloat(l2) },
            map: this.googleMap,
        });



    placeMarkers = (information) => {

        for (const a of this.state.add) {
            const marker = this.createMarker(a.lat, a.lng)

            marker.addListener('click', function () {
                information.setContent(`
            <div id = "pins">
                <p>
                    <b> ${a.name} </b>
                    <br>
                    Serves = ${a.serves} 
                    <br>
                    Pickup = ${a.time_from.slice(0, -3)}- ${a.time_to.slice(0, -3)} on ${a.listing_date}
                </p>
            </div>
            `)
                information.open(this.googleMap, marker);
            });
        }
    }


    handlepickup(listing) {
        if (this.state.qty > listing.serves) {
            alert("Not enough food, please try with a lower quantity")
            return
        }

        listing.serves = listing.serves - this.state.qty
        this.setState({ serves: listing.serves })

        fetch('/update-listing',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    listing_id: listing.listing_id,
                    qty: this.state.qty,
                    user_id: localStorage.getItem("user_id")
                })

            })

            .then(function (res) {
                return res.json()
            })

            .then(data_ => {
                if (data_ === "Order Placed") {
                    localStorage.setItem("listing_id", listing["listing_id"])

                    alert(data_)

                    fetch('/place-order',
                        {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: localStorage.getItem("user_id"),
                                order_qty: this.state.qty,
                                listing_id: localStorage.getItem("listing_id"),

                            })
                        }
                    )

                        .then(function (res) {
                            return res.json()
                        })

                        .then(data => {
                            localStorage.removeItem("listing_id")
                        }
                        )
                    return
                }

                alert(data_)

            })
    }


    render() {
        if (this.state.mapLoaded && this.state.add) {

            this.placeMarkers(this.info)
        }

        if (this.state.loggedIn === false) {
            return (<Redirect key="render" to="/" />)
        }

        else {

            return (
                <div id="all_listings"  style={{
                    // backgroundImage: "url(" + " /static/images/marble.jpeg" + ")",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>

                    <nav className="navbar navbar-expand-md navbar-dark sticky-top" style = {{backgroundColor: "#e2bd19"}}>
                        <div className="container-fluid" id="listings_buttons">
                        
                            <Link to="/listings" className="navbar-brand" style={{color:"black"}}><i class="fa fa-home" aria-hidden="true"></i>
                            HomNom</Link>

                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarResponsive" value="new-listing">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">


                                    <li key="name" className="nav-item active input-group-text" style={{backgroundColor:"#e2bd19", border:"0px", color:"black", fontWeight:"bold"}}>
                                        Hi, {localStorage.getItem("user_name")} !
                                    </li>

                                    
                                    <li key="ul" className="nav-item active">
                                        <Link to="/new-listing" className="nav-link" value="new-listing" style={{color:"black"}}> Upload Listing </Link>
                                    </li>

                                    <li key="orders" className="nav-item active">
                                        <Link to="/order" className="nav-link" type="submit" href="/order" value="see-orders"  style={{color:"black"}}> Orders </Link>
                                    </li>

                                    <li key="listings" className="nav-item active">
                                        <Link to="/your-listings" className="nav-link" type="submit" value="see-listings" style={{color:"black"}} > Listings </Link>
                                    </li>

                                    <li key="logout" className="nav-item active" >
                                        <Link to="/logout" className="nav-link"  style={{color:"black"}}> Log Out </Link>
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </nav>

                    <div className="container my-container" id="show_listings" key="render_listings" >
                        <div className="row" style={{  minHeight:'300px'}}>
                            <div
                                className=" col-lg-12 col-md-8 my-map"
                                key="render_map"
                                id="google-map"
                                ref={this.googleMapRef}
                                style={{ width: '100%', height: '300px' , minHeight:'300px', padding: '2%'}}
                            >
                            </div>

                            

                        </div>
                        <div className= "row">
                            <div className="card col-4 mx-auto my-4 shadow-sm" style={{borderRadius: '2.5rem',border: '2px solid #e2bd19'}}>
                                    <div className="card-body d-flex align-items-center flex-column ">
                                        <h5 className="card-title">Order for</h5>

                                    </div>
                                    <div className="card-body ">
                                    <select className="form-control" id="qty" onChange={this.handleqty}>
                                            <option className= "dropdown-item" key="1" value="1">1</option>
                                            <option className= "dropdown-item"  key="2" value="2">2</option>
                                            <option className= "dropdown-item"  key="3" value="3">3</option>
                                            <option className= "dropdown-item"  key="4" value="4">4</option>
                                        </select>
                                       
                                    </div>
                            </div>
                        </div>

                        <div className="row my-row d-flex justify-content-around" id="each-listing" >
                            {this.state.listings.map((listing, index) => (

                                <div className="card col-5 m-2 shadow-sm" key={listing.listing_id} style={{borderRadius: '2.5rem',border: '2px solid #e2bd19'}}>
                                    <div className="card-body d-flex align-items-center flex-column">
                                        <h5 className="card-title">{listing.listing_id}. {listing.name}</h5>
                                        <p className="card-text">{listing.description}</p>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Serves: {listing.serves}</li>
                                        <li className="list-group-item">Address: {listing.address}, {listing.city}</li>
                                        <li className="list-group-item">Pickup Window : {listing.time_from.slice(0, -3)} - {listing.time_to.slice(0, -3)} on {listing.listing_date}</li>

                                    </ul>
                                    <div className="card-body ">
                                        <button className="btn pickup " type="submit" value="order" onClick={this.handlepickup.bind(this, listing)}> Request pickup</button>
                                    </div>
                                </div>
                            )
                            )}
                        </div>
                    </div>

                </div>
            )
        }
    }
}




