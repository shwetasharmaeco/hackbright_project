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

@app.route('/all-listings')
def all_listings():
    main_list=[]
    listings = crud.all_listings()
   
    for listing in listings:
        dict_ = {}
        user = crud.get_user_by_id(listing.user_id)
        city = crud.get_city_by_id(listing.city_id)
        category = crud.get_category_by_id(listing.category_id)
        dict_["user"] = user.name
        dict_["name"] = listing.listing_name
        dict_["description"] = listing.description
        dict_["serves"]=listing.serves
        dict_["category"]= category.category_name
        dict_["address"]=listing.listing_address
        dict_["city"]= city.city_name
        dict_["time_from"]=listing.time_from
        dict_["time_to"]=listing.time_to
        main_list.append(dict_)
    return json.dumps(main_list)


@app.route('/sign-up', methods=['POST',"GET"])
def handle_sign_up():
    """Create a new user."""

    data = request.get_json()
    user = crud.get_user_by_email(data["email"])
    city = crud.get_city_by_name(data["city"])
    

    if user:
        return jsonify('Cannot create an account with that email. Try again.')
    else:
        if not city:
            return jsonify("We are not currently operating in your city")
        else:
            
            crud.create_user(data["name"], data["number"], data["address"], data["email"],data["password"], city.city_id)
            return jsonify('Account created! Please log in')


@app.route('/new-listing', methods=["POST"])
def new_listing():
    """ creates new listing """
    data = request.get_json()
    user = crud.get_user_by_email(data["lister_email"])
    category = crud.get_category_by_name(data["category"])
    city = crud.get_city_by_name(data["city"])

  
    if user:
        
        print("********trying to create a listing")
    
        crud.create_listing(user.user_id, data["listing_name"], data["serves"], 
                           category.category_id, data["description"], data["listing_address"],
                            city.city_id, data["time_from"], data["time_to"])
        return jsonify(f'Thank you {user.name}! Your listing has been added')
    
    else:
        return jsonify("Please enter correct email")




@app.route('/sign-in', methods=["POST","GET"])
def handle_sign_in():
    """Log user into application."""

    data = request.get_json()
    user = crud.get_user_by_email(data["email"])
    
    if user:
        
        if user.password == data["password"] and user.email == data["email"]:
            session["user_id"] = user.user_id
            return jsonify('Logged in')
        else:
            return jsonify('Wrong email or password!')
    else:
        
        return jsonify("email doesn't exist")
   
  



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)