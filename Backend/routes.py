from flask import render_template, request
from .models import User


def register_routes(app, db):
    
    @app.route('/')
    def index():
        # if request.method == 'GET':
        users = User.query.all()
        return render_template("index.html")
        # elif request.method == 'POST':
        #     name =
        
    @app.route('/navbar')
    def navbar():
        return render_template("_navbar.html")
    
    @app.route('/food')
    def food():
        return render_template("food.html")