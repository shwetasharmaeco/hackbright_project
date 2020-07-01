from unittest import TestCase
from server import app
from model import connect_to_db, db
from flask import jsonify, json


class FlaskTestsRoutes(TestCase):
    """Flask tests."""

    def setUp(self):

        """Stuff to do before every test."""

        # Get the Flask test client
        connect_to_db(app)
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config['TESTING'] = True


    def test_index(self):

        """Test homepage page."""

        result = self.client.get("/")
        self.assertIn(b"HomNom", result.data)


    def test_signup(self):
        """Test create account page."""
        
        result = self.client.post("/sign-up",
                                json = {"email": "shwetasharmaeco@gmail.com", 
                                "city": "San Francisco"}, follow_redirects=True)
        self.assertIn(b"Try again.", result.data)


    def test_login(self):
        """Test login page."""
        
        result = self.client.post("/sign-in",
                                json = {"email": "shwetasharmaeco@gmail.com", 
                                "password": "123"}, follow_redirects=True)
        self.assertIn(b"user_id", result.data)
        self.assertNotIn(b"error", result.data)


    def test_listings_page(self):

        """ Test main listings page """

        result = self.client.post("/all-listings",
                                follow_redirects=True)
        self.assertIn(b"user", result.data)
        self.assertNotIn(b"Login Page", result.data)


    def test_upload_listing(self):

        """ Test upload a new listing page """

        result = self.client.post("/new-listing",
                                json = {"user_id": 200,
                                "listing_name": "something",
                                "serves": 5,
                                "description":"", 
                                "listing_address": "2nd St",
                                "category": "Home Cooked",
                                "city": "San Francisco",
                                "zipcode": "94117"},
                                follow_redirects=False)
        self.assertIn(b"Listing could not be created", result.data)
        self.assertNotIn(b"For", result.data)


    def test_update_listing(self):

        """ test listing update on placing order """

        result = self.client.post("/update-listing",
                                json = {"user_id": 11,
                                "listing_id": 16,
                                "qty" :10},
                                follow_redirects=False)
        self.assertIn(b"Sorry! We do not have enough food" ,result.data)
        # self.assertNotIn(b"For", result.data)


    def test_user_orders(self):

        """ test order page of a user """

        result = self.client.post("/your-orders",
                                json = {"user_id": 11,},
                                follow_redirects=False)
        self.assertNotIn(b"[]" ,result.data)
        self.assertIn(b"7" ,result.data)


    def test_user_listings(self):

        """ test order page of a user """

        result = self.client.post("/your-listings",
                                json = {"user_id": 11,},
                                follow_redirects=False)
        self.assertIn(b"Chicken" ,result.data)
        self.assertNotIn(b"[]" ,result.data)

    
    def test_changes(self):

        """ test update by a poster """

        result = self.client.post("/lister-updates",
                                json = {"listing_id": 1000,
                                "update_serves": 4},
                                follow_redirects=False)
        self.assertIn(b"Couldn't update servings" ,result.data)
        self.assertNotIn(b"servings updated" ,result.data)
        
        

class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///food")

        # Create tables and add sample data
        db.create_all()
        

    # def tearDown(self):
    #     """Do at end of every test."""\q
    

    #     db.session.remove()
    #     db.drop_all()
    #     db.engine.dispose()

    def test_cities_list(self):

        """Test cities data."""

        result = self.client.get("/cities")
        self.assertIn(b"San Francisco", result.data)


    def test_categories_list(self):

        """Test categories data."""

        result = self.client.get("/categories")
        self.assertIn(b"Other", result.data)





    


if __name__ == "__main__":
    import unittest

    unittest.main()