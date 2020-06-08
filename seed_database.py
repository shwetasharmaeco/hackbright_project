import os
import json
import crud
from faker import Faker
import model
import server
from random import choice, randint
from datetime import datetime 
fake = Faker()

os.system('dropdb food')
os.system('createdb food')

model.connect_to_db(server.app)
model.db.create_all()

##### CITY ######
cities_list = []
for n in range (5):
    zipcode = fake.postcode()
    city_name = fake.city()
    city = crud.create_city(city_name, zipcode)
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



   
##### CATEGORY ####
categories_list=[]
for n in range (15):
    category_name = fake.word()
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
    city = choice(cities_list)
    city_id = city.city_id
    time_from= fake.time()
    time_to = fake.time()
    # time_from= fake.date_time_this_month(before_now=False, after_now =False)
    # time_to = fake.date_time_this_month(before_now=False, after_now =False)


    listing = crud.create_listing(user_id,listing_name, serves, category_id, 
                    description, listing_address, city_id, time_from, time_to)
    listings_list.append(listing)


##### ORDERS #########
orders_list = []

for n in range(6):
    user = choice(users_list)
    order_qty = randint(1,3)
    listing = choice(listings_list)
    confirmed_at = datetime.now()
    order = crud.create_order(user=user, order_qty=order_qty,
                             listing= listing, 
                             confirmed_at=confirmed_at)
