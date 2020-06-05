

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;




import nav from './nav';
import signup from './signup';
import login from './login';


class App extends React.Component{
    state ={
        signUp: false
    }
    render(){
        return(
            <div>
            <Router>
                <div className = "App">
                    <nav/>
                    <Switch>
                    <Route path="/"  component={home}/>
                    <Route path="/signup" component={signup}/>
                    <Route path="/login" component={login}/>
                    </Switch>
                </div>
            </Router>
            </div>  
        
        );
    }
}


const home=() =>(
    <div>
        <h1>
            home page
        </h1>
    </div>
);


ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
// export default App;


  














