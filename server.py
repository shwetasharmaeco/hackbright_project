"""Server for movie ratings app."""
from flask import (Flask, render_template, request, flash, session,
                   redirect,jsonify,json)

from datetime import (datetime,date, timedelta,time)

from model import connect_to_db
import crud
from jinja2 import StrictUndefined
import urllib.request
import pytz
from pytz import timezone
# from twilio.rest import Client

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

@app.route('/all-listings', methods=["POST"])
def all_listings():
    main_list=[] 
    listings = crud.all_listings()
    data = request.get_json()
   
    # date_today = date.today()
    date_today = datetime.utcnow() - timedelta(hours=7)
    # current_time = date_today.strftime("%H:%M:%S")
    final_time = date_today.strftime("%H:%M")
    final_time_time= datetime.strptime(final_time, '%H:%M').time()
    # print("final_time_time:" ,final_time_time)
    # print("date",date_today)

   
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
        # listing.listing_date.isoformat()
        time_from = datetime.strptime(listing.time_from, '%H:%M').time()
        # dict_["time_from"]=listing.time_from
        dict_["time_from"]=time_from
        time_to = datetime.strptime(listing.time_to, '%H:%M').time()
        # dict_["time_to"]=listing.time_to
        dict_["time_to"]=time_to

        if dict_["serves"] == 0  :     
            continue    
        if  listing.listing_date < date_today.date():
            continue
        # if int(listing.time_to) < date_today.hour :
        #     continue
        if  time_to < final_time_time:
            # print("True")
            # print(time_to, final_time_time)
            continue

        
        else:
            main_list.append(dict_)
    return json.dumps(main_list, indent=4, sort_keys=True, default=str)
    # json.dumps(anObject, default=json_util.default)




@app.route("/all-addresses", methods=["POST","GET"] )
def all_add():
    all_add=[]
    listings = crud.all_listings()
    # date_today = date.today()
    date_today = datetime.utcnow() - timedelta(hours=7)
    final_time = date_today.strftime("%H:%M")
    final_time_time= datetime.strptime(final_time, '%H:%M').time()
    # date_today = date.today() - timedelta(hours=8)
    
    for listing in listings:
        dict_a={}
        # city = crud.get_city_by_id(listing.city_id)
        dict_a["lat"]= listing.lat
        dict_a["lng"]= listing.lng
        dict_a["name"] = listing.listing_name
        dict_a["serves"]=listing.serves
        # dict_a["listing_date"]= listing.listing_date
        dict_a["listing_date"]=  listing.listing_date.strftime("%A %d %B, %Y")
        time_from = datetime.strptime(listing.time_from, '%H:%M').time()
        # dict_["time_from"]=listing.time_from
        dict_a["time_from"]=time_from
        time_to = datetime.strptime(listing.time_to, '%H:%M').time()
        # dict_["time_to"]=listing.time_to
        dict_a["time_to"]=time_to
        # dict_a["time_from"]=listing.time_from
        # dict_a["time_to"]=listing.time_to
        if dict_a["serves"] == 0:    
            continue    
        if  listing.listing_date < date_today.date():
            continue
        if  time_to < final_time_time:
            continue

        else:
            all_add.append(dict_a)
        
        # all_add.append(dict_a)
    # print(all_add)
    return json.dumps(all_add, indent=4, sort_keys=True, default=str)


@app.route('/your-orders', methods=["POST","GET"])
def show_orders():
    # print("*****I was here")
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
        
        # dict_o["listing_date"]=o.listing_date
        dict_o["listing_date"]=  o.listing_date.strftime("%A %d %B, %Y")
        all_orders.append(dict_o)
    # print(all_orders)

    # (user_id, listing_name, serves, category_id,  
    #                 description, listing_address, city_id, time_from, time_to)
    return json.dumps(all_orders)


@app.route('/your-listings', methods=["POST","GET"])
def show_listings():
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
        # dict_l["listing_date"]=l.listing_date
        dict_l["listing_date"]=  l.listing_date.strftime("%A %d %B, %Y")
        dict_l["time_from"]=l.time_from
        dict_l["time_to"]=l.time_to
        all_listings.append(dict_l)
    return json.dumps(all_listings)






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
    # print(data_)
    # account_sid = 'ACbeabb390211276eba39356dad00d0a99'
    # auth_token = "09649e43970542e7f70ad32bfbd5fdf0"
    # client = Client(account_sid, auth_token)
 
    listing = crud.get_listing_by_id(data_["listing_id"])
    # print("*******",listing.serves)
    # while True:
    if listing:
    
        if listing.serves >= int(data_["qty"]):
            serves = listing.serves - int(data_["qty"])
            crud.update_serves_for_listing_by_id(listing.listing_id,serves)
            listing = crud.get_listing_by_id(data_["listing_id"])
            # message = client.messages.create(
            #                   body='Hi there!',
            #                   from_='+17348469615',
            #                   to='+17348469615'
            #               )

            # print(message.sid)
            # print("*******",listing.serves)
            return jsonify("Order Placed")
        else:
            return jsonify("Sorry! We do not have enough food")

    else:
        return jsonify("no listing found")
        


@app.route("/lister-updates", methods=['POST',"GET"])
def lister_updates():
    data = request.get_json()
    listing = crud.get_listing_by_id(data["listing_id"])

    if listing:
        serves = data["update_serves"]
        crud.update_serves_for_listing_by_id(listing.listing_id,serves)
        return jsonify("servings updated")
    else:
        return jsonify("Couldn't update servings")
  

API_KEY =  "AIzaSyB_A07jL5otsFc8gDAvgZgcbHugwh9xO18"
GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json"      


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
                           category.category_id, data["description"], data["listing_address"],data["zipcode"], coords["lat"], coords["lng"],
                            city.city_id, data["date"],data["time_from"], data["time_to"])
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
        
        return jsonify({"error": "Email doesn't exist. Please create an account"})


@app.route('/place-order', methods=["POST","GET"] )
def place_order():
    # print("*****I was here")
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



#and datetime_object < date_today:
           
      # datetime_object = datetime.strptime(dict_["listing_date"], "%Y-%m-%d" )