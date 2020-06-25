""" CRUD operations for hackbright_project"""

from model import db, User, City, Category, Listing, Order, connect_to_db
from sqlalchemy.sql import func

def create_city(city_name):
    """ creates and returns a city object """

    city = City(city_name = city_name)

    db.session.add(city)
    db.session.commit()

    return city

def create_user(name, phone, street_address, email,password, city_id):
    """ create  and return user if doesn't already exists in database """

    

    user =  User (name = name, phone = phone, 
                street_address=street_address, 
                email = email, 
                password = password, 
                city_id = city_id)

    db.session.add(user)
    db.session.commit()

    return user



def create_listing(user_id, listing_name, serves, category_id,  
                    description, listing_address,listing_zipcode,lat, lng, city_id, listing_date,time_from, time_to):
    """ create and return listing """

    listing = Listing(user_id= user_id,
                    listing_name = listing_name, 
                    serves = serves, 
                    category_id = category_id, 
                    description = description, 
                    listing_address = listing_address, 
                    listing_zipcode = listing_zipcode,
                    lat = lat,
                    lng =lng,
                    city_id = city_id,
                    listing_date = listing_date,
                    time_from = time_from, 
                    time_to= time_to)

    db.session.add(listing)
    db.session.commit()

    return listing



def create_category(category_name):

    category = Category(category_name = category_name)

    db.session.add(category)
    db.session.commit()

    return category

def create_order(user_id, order_qty, listing_id, confirmed_at):

    order = Order(user_id=user_id, order_qty = order_qty,listing_id = listing_id, confirmed_at = confirmed_at)

    db.session.add(order)
    db.session.commit()

    return order


def all_users():
    return User.query.all()

def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_user_by_email(email):
    return User.query.filter(User.email == email).first()

def get_category_by_id(category_id):
    return Category.query.get(category_id)

def get_category_by_name(categoryName):
    return Category.query.filter(Category.category_name == categoryName).first()

def all_listings():
    return Listing.query.order_by(Listing.listing_id).all()

def get_listing_by_id(listing_id):
    return Listing.query.get(listing_id)


def update_serves_for_listing_by_id(listing_id,serves):
    Listing.query.filter(Listing.listing_id == listing_id).update({Listing.serves: serves}, synchronize_session="fetch") 
    
    db.session.commit() 
    
 
def group_orders_by_id(user_id):
    # return db.session.query((Order.listing_id)).group_by(Order.user_id,Order.listing_id).having(Order.user_id == user_id).all()
    return Order.query.filter(Order.user_id == user_id).all()


def group_listings_by_id(user_id):
    # return db.session.query(Listing.listing_id).group_by(Listing.user_id, Listing.listing_id).having(Listing.user_id == user_id).all()
    return Listing.query.filter(Listing.user_id==user_id).all()

# def delete_listing():
#     Listing.query.filter(Listing.serves == 0).delete()

def commit():
    db.session.commit()

def all_cities():
    return City.query.all()

def get_city_by_name(city_name):
    return City.query.filter(City.city_name == city_name).first()

def get_city_by_id(city_id):
    return City.query.get(city_id)

def all_orders():
    return Order.query.all()

def all_categories():
    return Category.query.all()

 

if __name__ == '__main__':
    from server import app
    connect_to_db(app)