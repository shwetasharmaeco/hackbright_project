

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const withRouter = window.ReactRouterDOM.withRouter;


class App extends React.Component{
    render(){
        return(
        <div>
            <Router>
                <div className = "App">
                <Switch>
                    <Route  path="/signup" exact component={Signup}/>
                    <Route  path="/" key = "render" exact component={Login}/>
                    <Route  path="/listings"  key = "render" exact render={()=><Listing/>}/> 
                    <Route  path="/new-listing" exact component={NewListing}/>
                    <Route  path = "/logout" exact component = {Logout}/>
                    <Route  path = "/order" exact component = {Order}/>
                    <Route  path = "/your-listings" exact  component={YourListing}/> 
                </Switch>
                </div>
            </Router>
        </div>  
        
        );
    }
}





ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );


 
  














