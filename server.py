"""Server for movie ratings app."""
from flask import (Flask, render_template, request, flash, session,
                   redirect,jsonify,json)

from model import connect_to_db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def homepage():
    
    return render_template ('index.html')

@app.route('/api/cities')
def all_cities():
    cities = crud.all_cities()
    
    return jsonify(cities)



@app.route('/sign-up', methods=['POST',"GET"])
def handle_sign_up():
    """Create a new user."""

    data = request.get_json()
    user = crud.get_user_by_email(data["email"])
    

    if user:
        return jsonify('Cannot create an account with that email. Try again.')
    else:
        if data["city"] not in crud.use():
            return jsonify("We are not currently operating in your city")
        else:
            crud.create_user(data["name"], data["number"], data["address"], data["email"],data["password"], data["city"])
            return jsonify( f'Account created! Please log in {data["name"]}')




@app.route('/sign-in', methods=["POST","GET"])
def handle_sign_in():
    """Log user into application."""

    data = request.get_json()
    user = crud.get_user_by_email(data["email"])
    
    if user:
        
        if user.password == data["password"] and user.email == data["email"]:
            session["user_id"] = user.user_id
            return jsonify(f'Logged in as {user.name}')
        else:
            return jsonify('Wrong email or password!')
    else:
        
        return jsonify("email doesn't exist")
   
  



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)