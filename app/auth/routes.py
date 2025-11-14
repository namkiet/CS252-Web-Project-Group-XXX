from flask import render_template, request, Blueprint, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from app.models.user import User
from app.forms import RegisterForm
from app.forms import LoginForm
from app import db
from . import bp

@bp.route('/register', methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        user_create = User(name=form.username.data, 
                           password_hash = generate_password_hash(form.password.data))
        # db.session.add(user_create)
        # db.session.commit()
        return redirect('food')
    if form.errors != {}:
        for msg in form.errors.values():
            flash(f"Error: {msg}", category='danger')
    return render_template('register.html', form=form)

@bp.route('/login', methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        
        # db.session.add(user_create)
        # db.session.commit()
        return redirect('food')
    if form.errors != {}:
        for msg in form.errors.values():
            flash(f"Error: {msg}", category='danger')
    return render_template('login.html', form=form)