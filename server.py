"""Server for movie ratings app."""
from flask import (Flask, render_template, request, flash, session,
                   redirect,jsonify,json)

from datetime import datetime

from model import connect_to_db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def homepage():
    
    return render_template ('index.html')


@app.route("/categories")
def all_categories():
    categories_=[]
    categories = crud.all_categories()
    for category in categories:
        g_dict={}
        g_dict["category_name"] = category.category_name
        categories_.append(g_dict)
    return json.dumps(categories_)

@app.route('/cities')
def all_cities():
    cities_=[]
    cities = crud.all_cities()
    for city in cities:
        c_dict={}
        c_dict["zipcode"]=city.zipcode
        c_dict["city_name"]=city.city_name
        cities_.append(c_dict)
    
    return json.dumps(cities_)

@app.route('/all-listings')
def all_listings():
    main_list=[]
    listings = crud.all_listings()
    data = request.get_json()
   
    for listing in listings:
        dict_ = {}
        user = crud.get_user_by_id(listing.user_id)
        city = crud.get_city_by_id(listing.city_id)
        category = crud.get_category_by_id(listing.category_id)
        dict_["user"] = user.name
        dict_["listing_id"] = listing.listing_id
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


@app.route('/your-orders', methods=["POST","GET"])
def show_orders():
    print("*****I was here")
    data = request.get_json()
    user_id = data["user_id"]
    orders = crud.group_orders_by_id(user_id)
    all_orders=[]
    for order in orders:
        dict_o={}
        o = crud.get_listing_by_id(order)
        dict_o["listing_name"] = o.listing_name
        dict_o["listing_address"] = o.listing_address
        dict_o["listing_time_from"]= o.time_from 
        dict_o["listing_time_to"]= o.time_to
        all_orders.append(dict_o)
    # print(all_orders)

    # (user_id, listing_name, serves, category_id,  
    #                 description, listing_address, city_id, time_from, time_to)
    return json.dumps(all_orders)





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



@app.route("/update-listing", methods=['POST',"GET"])
def update_listing():
    data_ = request.get_json()
    print(data_)
 
    listing = crud.get_listing_by_id(data_["listing_id"])
    print("*******",listing.serves)
    # while True:
    if listing:
    
        if listing.serves >= int(data_["qty"]):
            serves = listing.serves - int(data_["qty"])
            crud.update_serves_for_listing_by_id(listing.listing_id,serves)
            listing = crud.get_listing_by_id(data_["listing_id"])
            print("*******",listing.serves)
            return jsonify("Order Placed")
        else:
            return jsonify("Sorry! We do not have enough food")

    else:
        return ("no listing found")
        
  
        


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
            # session["user_id"] = user.user_id
            return jsonify({"user_id": user.user_id})
        else:
            return jsonify({"error": "Wrong email or password"})
    else:
        
        return jsonify({"error": "email doesn't exist"})


@app.route('/place-order', methods=["POST","GET"] )
def place_order():
    print("*****I was here")
    data = request.get_json()
    user_id = data["user_id"]
    order_qty = data["order_qty"]
    listing_id = data["listing_id"]
    confirmed_at=datetime.now()
    crud.create_order(user_id,order_qty,listing_id,confirmed_at)
    # (user_id, order_qty, listing_id, confirmed_at)
    return jsonify("Order created")

   




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)