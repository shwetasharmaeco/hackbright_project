""" CRUD operations for hackbright_project"""

from model import db, User, City, Category, Listing, Order, connect_to_db


def create_city(city_name, zipcode):
    """ creates and returns a city object """

    city = City(city_name = city_name, zipcode = zipcode)

    db.session.add(city)
    db.session.commit()

    return city

def create_user(name, phone, street_address, email,password, user_city):
    """ create  and return user if doesn't already exists in database """

    user =  User (name = name, phone = phone, 
                street_address=street_address, 
                email = email, 
                password = password, 
                user_city = user_city)

    db.session.add(user)
    db.session.commit()

    return user



def create_listing(user, listing_name, serves, category,  
                    description, listing_address, city, time_from, time_to):
    """ create and return listing """

    listing = Listing(user=user,
                    listing_name = listing_name, 
                    serves = serves, 
                    category = category, 
                    description = description, 
                    listing_address = listing_address, 
                    city = city,
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

def create_order(user, order_qty, listing, confirmed_at):

    order = Order(user=user, order_qty = order_qty,listing = listing, confirmed_at = confirmed_at)

    db.session.add(order)
    db.session.commit()

    return order


def all_users():
    return User.query.all()

def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_user_by_email(email):
    return User.query.filter(User.email == email).first()

def all_listings():
    return Listing.query.all()

def get_listing_by_id(listing_id):
    return Listing.query.get(listing_id)

def all_cities():
    return City.query.all()

def all_orders():
    return Order.query.all()

def all_categories():
    return Category.query.all()

 

if __name__ == '__main__':
    from server import app
    connect_to_db(app)