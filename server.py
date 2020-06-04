"""Server for movie ratings app."""
from flask import (Flask, render_template, request, flash, session,
                   redirect)

from model import connect_to_db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def homepage():
    cities = crud.all_cities()
    return render_template ('index.html', cities = cities)

@app.route('/sign-up', methods=['POST'])
def handle_sign_up():
    """Create a new user."""
    name = request.form.get('user_name')
    phone = request.form.get('phone')
    street_address = request.form.get('street_address')
    user_city = request.form.get('city')
    # if user_city not in cities table #
    email = request.form.get('email')
    password = request.form.get('password')

    user = crud.get_user_by_email(email)
    if user:
        flash('Cannot create an account with that email. Try again.')
    else:
        crud.create_user(name, phone, street_address, email,password, user_city)
        flash('Account created! Please log in.')

    

    # return redirect('/')

@app.route('/sign-in')
def handle_sign_in():
    """Log user into application."""

    email = request.form['email']
    password = request.form['password']

    user = crud.get_user_by_email(email)

    if user:

        if user.password == password and user.email == email:
            flash(f'Logged in as {email}')
        else:
            flash('Wrong email or password!')
    else:
        flash("email doesn't exist")
    return redirect ('/')



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)