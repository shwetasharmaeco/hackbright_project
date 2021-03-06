import os
import json
import crud
from faker import Faker
import model
import server
import random
from random import choice, randint
from datetime import datetime 
fake = Faker()

os.system('dropdb food')
os.system('createdb food')

model.connect_to_db(server.app)
model.db.create_all()

##### CITY ######
cities_list = []
cities_names=[]
c = ["San Francisco", "Oakland", "Fremont", "San Jose", "Stockton", "Santa Clara", "Berkley" ]
for city in c:

    # zipcode = fake.postcode()
    city_name = city
    
    city = crud.create_city(city_name)
    cities_list.append(city)  


###### USER #######
users_list = []
for n in range(10):
    name = fake.name()
    email = fake.email()
    city = choice(cities_list)
    city_id = city.city_id
    street_address =  fake.address()
    phone = fake.phone_number()
    password = fake.word()

    user = crud.create_user(name, phone, street_address,email, password, city_id)
    users_list.append(user)

me = crud.create_user("Shweta Sharma", "7348469615", "269 Hermann St", "shwetasharmaeco@gmail.com", "123", 1)



   
##### CATEGORY ####
categories_list=[]
cat = ["Home Cooked", "Restaurant food", "Packaged food", "Vegetables", "Fruits", "Other"]
for n in cat:
    category_name = n

    category = crud.create_category(category_name)
    categories_list.append(category)



###### LISTING ######
listings_list = []
for n in range(15):
    user = choice(users_list)
    user_id = user.user_id
    listing_name = fake.word()
    serves = randint(0,10)
    category = choice(categories_list)
    category_id = category.category_id
    description = fake.sentence()
    listing_address = fake.address()
    listing_zipcode = fake.postcode()
    lat = fake.latitude()
    lng = fake.longitude()
    city = choice(cities_list)
    city_id = city.city_id
    listing_date = fake.date()
    time_from= "03:55"
    time_to = "05:00"
   


    listing = crud.create_listing(user_id,listing_name, serves, category_id, 
                    description, listing_address, listing_zipcode, lat, lng ,city_id, listing_date,time_from, time_to)
    listings_list.append(listing)

my_listing = crud.create_listing(11, "Chicken", 6, 1, "Indian style spicy chicken curry","269 Hermann St", "94117", 
                                    "37.770110","-122.429490", 1, "2020/08/18", "07:00", "23:00" )


##### ORDERS #########
orders_list = []

for n in range(6):
    user = choice(users_list)
    order_qty = randint(1,3)
    listing = choice(listings_list)
    confirmed_at = datetime.now()
    order = crud.create_order(user_id=user.user_id, order_qty=order_qty,
                             listing_id= listing.listing_id, 
                             confirmed_at=confirmed_at)

my_order = crud.create_order(11, 1, 16, datetime.now())
