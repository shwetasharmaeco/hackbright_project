


class Logout extends React.Component {
    constructor(){
        super();
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("user_name")
    }
    render() {
        return (
            <div  id="logout"
            style={{
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