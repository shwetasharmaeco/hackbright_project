""" Model for food-app """

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class City(db.Model):
    __tablename__ = "cities"

    city_id = db.Column (db.Integer, 
                    autoincrement = True, 
                    primary_key = True,
                    nullable = False)

    zipcode = db.Column(db.String)

    city_name = db.Column (db.String, unique = True, nullable = False)


    def __repr__(self):
        return f'<City city_id={self.city_id} name={self.city_name}>'

class User(db.Model):

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                         unique =True, nullable= False, 
                         autoincrement = True, 
                         primary_key = True
                         )
    name = db.Column(db.String(50),
                      nullable= False,)

    street_address = db.Column(db.String, nullable = False)


    phone = db.Column(db.String, nullable = False)

    email = db.Column (db.String, nullable = False, unique = True)

    password = db.Column (db.String, nullable = False)

    user_city = db.Column (db.String, db.ForeignKey("cities.city_name"),
                            nullable = False)

    # city_id = db.Column(db.Integer,
    #                     db.ForeignKey("cities.city_id"))


    city = db.relationship('City', backref='user')
    order = db.relationship('Order', backref='user')
    listing = db.relationship('Listing', backref='user')
    


    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'




class Category(db.Model):

    __tablename__ = "categories"

    category_id = db.Column(db.Integer, 
                    autoincrement = True, 
                    primary_key = True,
                    nullable = False)
    
    category_name = db.Column(db.String)

    # listing = db.relationship("Listing", backref = "category")

    def __repr__(self):
        return f'<Category categiry_id={self.category_id} name={self.category_name}>'


class Listing(db.Model):

    __tablename__ = "listings"

    listing_id = db.Column (db.Integer, 
                    autoincrement = True, 
                    primary_key = True,
                    nullable = False)

    user_id = db.Column (db.Integer, 
                        db.ForeignKey("users.user_id"))

    listing_name = db.Column(db.String,
                      nullable= False)

    serves = db.Column(db.Integer,)

    category_id = db.Column(db.Integer,
                            db.ForeignKey("categories.category_id"))

    # listing_category = db.Column(db.String)

    description = db.Column (db.Text)

    listing_address =  db.Column(db.String, nullable = False)

    city_id = db.Column(db.Integer,
                        db.ForeignKey("cities.city_id"))

    time_from = db.Column(db.String, nullable = False)

    time_to = db.Column(db.String, nullable = False)

    order = db.relationship('Order', backref='listing')
    category = db.relationship('Category', backref='listing')
    city = db.relationship('City', backref = 'listing')

    
    def __repr__(self):
        return f'<Listing listing_id={self.user_id} name={self.listing_name}>'


class Order(db.Model):

    __tablename__ = "orders"

    order_id = db.Column (db.Integer, 
                    autoincrement = True, 
                    primary_key = True,
                    nullable = False)

    user_id = db.Column (db.Integer,
                        db.ForeignKey("users.user_id"))

    order_qty = db.Column (db.Integer)

    listing_id = db.Column (db.Integer, 
                            db.ForeignKey("listings.listing_id"))

    confirmed_at = db.Column(db.DateTime, nullable = False)

    def __repr__(self):
        return f'<Order order_id={self.user_id} user_id={self.user_id} listing_id = {self.listing_id}>'





    
def connect_to_db(flask_app, db_uri='postgresql:///food', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    # flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)

