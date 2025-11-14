import re

from app.models.user import User

# data in form:
# {"username" : "name", "email" : "mail", "password" : "pass"}
# return errors: {"username":"error?", "email":"error?", "password":"error?"}
def validate_register(data):
    errors = {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip() #optinal
    password = data.get("password", "")

    # existing and length checks
    if not 2 <= len(username) <= 20:
        errors["username"] = "Username must be 2-20 characters."
    if User.query.filter_by(username=username).first():
        errors["username"] = "Username already exists."
    
    #optinal
    if email:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            errors["email"] = "Invalid email format."
        if User.query.filter_by(email=email).first():
            errors["email"] = "Email already registered."

    if len(password) < 6:
        errors["password"] = "Password must be at least 6 characters."

    # strong password checks
    if not re.search(r'[A-Z]', password):
        errors["password"] = "Must contain at least 1 uppercase."
    if not re.search(r'[a-z]', password):
        errors["password"] = "Must contain at least 1 lowercase."
    if not re.search(r'[0-9]', password):
        errors["password"] = "Must contain at least 1 digit."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors["password"] = "Must contain at least 1 special character."

    return errors