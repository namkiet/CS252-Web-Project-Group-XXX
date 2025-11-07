from flask import render_template, request
from .models import User


def register_routes(app, db):
    
    @app.route('/')
    def index():
        # if request.method == 'GET':
        users = User.query.all()
        return render_template("login.html", users=users)
        # elif request.method == 'POST':
        #     name =