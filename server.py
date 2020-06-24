"""Server for HomNom """


from flask import (Flask, render_template, request, flash, session,
                   redirect,jsonify,json)

from datetime import (datetime,date, timedelta,time)

from model import connect_to_db
import crud
from jinja2 import StrictUndefined
import urllib.request
import pytz
from pytz import timezone
from twilio.rest import Client

from keys import account_sid, auth_token 





app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


# Base route #

@app.route('/')
def homepage():
    
    return render_template ('index.html')



@app.route("/categories")
def all_categories():

    """ returns a list of all categories """

    categories_=[]
    categories = crud.all_categories()
    for category in categories:
        g_dict={}
        g_dict["category_name"] = category.category_name
        categories_.append(g_dict)
    return json.dumps(categories_)


@app.route('/cities')
def all_cities():

    """ returns a list of all cities """

    cities_=[]
    cities = crud.all_cities()
    for city in cities:
        c_dict={}
        c_dict["zipcode"]=city.zipcode
        c_dict["city_name"]=city.city_name
        cities_.append(c_dict)
    
    return json.dumps(cities_)


@app.route('/all-listings', methods=["POST"])
def all_listings():

    """ returns a list of all listings in the database """

    main_list=[] 
    listings = crud.all_listings()
    data = request.get_json()
   
    # converts time to PST #
    date_today = datetime.utcnow() - timedelta(hours=7)
    print("today:", date_today.date())

    # strips time from date document
    final_time = date_today.strftime("%H:%M")
    print("final time", final_time)
    #coverts string to time object
    final_time_time= datetime.strptime(final_time, '%H:%M').time()
    

   
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
        dict_["zipcode"]= listing.listing_zipcode
        dict_["city"]= city.city_name
        dict_["listing_date"]=  listing.listing_date.strftime("%A %d %B, %Y")
        time_from = datetime.strptime(listing.time_from, '%H:%M').time()
        dict_["time_from"]=time_from
        time_to = datetime.strptime(listing.time_to, '%H:%M').time()
        dict_["time_to"]=time_to

        # listings filters starts #
        if dict_["serves"] == 0  :     
            continue 

        if  listing.listing_date < date_today.date():
            continue

        if listing.listing_date == date_today.date() and time_to < final_time_time :
            continue
        
        else:
            main_list.append(dict_)

    return json.dumps(main_list, indent=4, sort_keys=True, default=str)
    




@app.route("/all-addresses", methods=["POST","GET"] )
def all_add():

    """returns list of addresses to place markers on google map"""

    all_add=[]
    listings = crud.all_listings()
    date_today = datetime.utcnow() - timedelta(hours=7)
    final_time = date_today.strftime("%H:%M")
    final_time_time= datetime.strptime(final_time, '%H:%M').time()
    
    
    for listing in listings:

        dict_a={}

        dict_a["lat"]= listing.lat
        dict_a["lng"]= listing.lng
        dict_a["name"] = listing.listing_name
        dict_a["serves"]=listing.serves
        dict_a["listing_date"]=  listing.listing_date.strftime("%A %d %B, %Y")
        time_from = datetime.strptime(listing.time_from, '%H:%M').time()
        dict_a["time_from"]=time_from
        time_to = datetime.strptime(listing.time_to, '%H:%M').time()
        dict_a["time_to"]=time_to
        
        if dict_a["serves"] == 0:    
            continue    

        if  listing.listing_date < date_today.date():
            continue

        if listing.listing_date == date_today.date() and time_to < final_time_time :
            continue

        else:
            all_add.append(dict_a)
        
     
    return json.dumps(all_add, indent=4, sort_keys=True, default=str)


@app.route('/your-orders', methods=["POST","GET"])
def show_orders():
    
    """ returns a list of orders for a particular user """

    data = request.get_json()
    user_id = data["user_id"]
    orders = crud.group_orders_by_id(user_id)
    all_orders=[]

    for order in orders:
        dict_o={}
        o = crud.get_listing_by_id(order.listing_id)
        dict_o["listing_name"] = o.listing_name
        city = crud.get_city_by_id(o.city_id)
        dict_o["listing_address"] = o.listing_address + ", " + city.city_name + " " + o.listing_zipcode
        dict_o["listing_time_from"]= o.time_from 
        dict_o["listing_time_to"]= o.time_to
        dict_o["listing_date"]=  o.listing_date.strftime("%A %d %B, %Y")
        all_orders.append(dict_o)

    return json.dumps(all_orders)



@app.route('/your-listings', methods=["POST","GET"])
def show_listings():

    """ returns a list of all listings posted by a partucular user """

    data = request.get_json()
    user_id = data["user_id"]
   
    listings = crud.group_listings_by_id(user_id)
    
    all_listings=[]

    for listing in listings:
        dict_l={}

        l = crud.get_listing_by_id(listing.listing_id)
        category = crud.get_category_by_id(l.category_id)

        city = crud.get_city_by_id(l.city_id)
        dict_l["listing_id"] = l.listing_id
        dict_l["name"] = l.listing_name
        dict_l["description"] = l.description
        dict_l["serves"]=l.serves
        dict_l["category"]= category.category_name
        dict_l["address"]=l.listing_address
        dict_l["city"]= city.city_name
        dict_l["listing_date"]=  l.listing_date.strftime("%A %d %B, %Y")
        dict_l["time_from"]=l.time_from
        dict_l["time_to"]=l.time_to
        all_listings.append(dict_l)

    return json.dumps(all_listings)






@app.route('/sign-up', methods=['POST',"GET"])
def handle_sign_up():

    """Creates a new user."""

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

    """ updates the quantity of serves after an order is placed, creates """

    data_ = request.get_json()
    
    sid = account_sid
    token = auth_token
    client = Client(sid, token)
    user = crud.get_user_by_id(data_["user_id"])
    listing = crud.get_listing_by_id(data_["listing_id"])
    lister = crud.get_user_by_id(listing.user_id)

    
    if listing:
    
        if listing.serves >= int(data_["qty"]):
            serves = listing.serves - int(data_["qty"])
            crud.update_serves_for_listing_by_id(listing.listing_id,serves)
            listing = crud.get_listing_by_id(data_["listing_id"])
            city = crud.get_city_by_id(listing.city_id)
            body_for_user = f"Hi there! You requested pickup for {listing.listing_name} \nFrom {listing.listing_address}, {city.city_name} {city.zipcode} \nPickup between {listing.time_from} - {listing.time_to} "
            body_for_lister = f"Hi there! {user.name} will pickup {listing.listing_name} between {listing.time_from} - {listing.time_to}"
            message = client.messages.create(
                              body=body_for_user,
                              from_='+12104465258',
                              to=user.phone
                          )

            message = client.messages.create(
                              body=body_for_lister,
                              from_='+12104465258',
                              to=lister.phone
                          )




            print(message.sid)
            return jsonify("Order Placed")

        else:
            return jsonify("Sorry! We do not have enough food")

    else:
        return jsonify("no listing found")
        


@app.route("/lister-updates", methods=['POST',"GET"])
def lister_updates():

    """ updates the quantity of serves if the poster make changes to serves """

    data = request.get_json()
    listing = crud.get_listing_by_id(data["listing_id"])

    if listing:
        serves = data["update_serves"]
        crud.update_serves_for_listing_by_id(listing.listing_id,serves)
        return jsonify("servings updated")

    else:
        return jsonify("Couldn't update servings")
  


# Google Maps API key for the following code #
API_KEY =  "AIzaSyB_A07jL5otsFc8gDAvgZgcbHugwh9xO18"
GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json" 
######################################################################     


@app.route('/new-listing', methods=["POST"])
def new_listing():

    """ creates new listing """

    data = request.get_json()


    params = urllib.parse.urlencode({"address": f'{data["listing_address"]} {data["city"]} {data["zipcode"]} CA' , "key": API_KEY})
    url = f"{GEOCODE_BASE_URL}?{params}"

    result = json.load(urllib.request.urlopen(url))

    if result["status"] in ["OK", "ZERO_RESULTS"]:
        coords = (result["results"][0]["geometry"]["location"])
    
    else:
        raise Exception(result["error_message"])


    user = crud.get_user_by_id(data["user_id"])
    category = crud.get_category_by_name(data["category"])
    city = crud.get_city_by_name(data["city"])

  
    if user:
        crud.create_listing(user.user_id, data["listing_name"], data["serves"], 
                        category.category_id, data["description"], 
                        data["listing_address"],data["zipcode"],
                        coords["lat"], coords["lng"],
                        city.city_id, data["date"],data["time_from"], 
                        data["time_to"])

        return jsonify(f'Thank you {user.name}! Your listing has been added')
    
    else:
        return jsonify("Please enter correct email")




@app.route('/sign-in', methods=["POST","GET"])
def handle_sign_in():

    """Log user into application if user information is in database"""

    data = request.get_json()
    user = crud.get_user_by_email(data["email"])
    
    if user:
        
        if user.password == data["password"] and user.email == data["email"]:
            # session["user_id"] = user.user_id
            return jsonify({"user_id": user.user_id})
        else:
            return jsonify({"error": "Wrong email or password"})

    else:
        
        return jsonify({"error": "Email doesn't exist. Please create an account"})



@app.route('/place-order', methods=["POST","GET"] )
def place_order():
    
    """ creates an order """

    data = request.get_json()
    user_id = data["user_id"]
    order_qty = data["order_qty"]
    listing_id = data["listing_id"]
    confirmed_at=datetime.now()
    crud.create_order(user_id,order_qty,listing_id,confirmed_at)
    
    return jsonify("Order created")

   




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
