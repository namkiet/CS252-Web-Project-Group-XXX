import re
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError

from app.models.user import User

class RegisterForm(FlaskForm):
    username = StringField(
        label='Username:', 
        validators=[DataRequired(), Length(min=2, max=20)]
    )
    
    email = StringField(
        label='Email:', 
        # validators=[Email()]
    )
    
    password = PasswordField(
        label='Password:', 
        validators=[DataRequired(), Length(min=6, max=20)]
    )
    
    confirm_password = PasswordField(
        label='Confirm Password:',
        validators=[DataRequired(), 
                    EqualTo("password", 
                    message="Passwords must match.")]
    )
    
    submit = SubmitField(label='Register')
    
    def validate_username(self, username_check):
        user = User.query.filter_by(username=username_check.data).first()
        if user:
            raise ValidationError('Username already exists')
    
    def validate_email(self, email_check):
        email = User.query.filter_by(email=email_check.data).first()
        if email:
            raise ValidationError('Email Address already exists')
    
    def validate_password(self, password_field):
        password = password_field.data
        if not re.search(r'[A-Z]', password):
            raise ValidationError('Password must contain at least one uppercase letter.')
        if not re.search(r'[a-z]', password):
            raise ValidationError('Password must contain at least one lowercase letter.')
        if not re.search(r'[0-9]', password):
            raise ValidationError('Password must contain at least one digit.')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError('Password must contain at least one special character.')
    
class LoginForm(FlaskForm):
    username = StringField(
        label='Username:', 
        validators=[DataRequired(), Length(min=2, max=20)]
    )
    
    email = StringField(
        "Email", 
        # validators=[DataRequired(), Email()]
    )
    
    password = PasswordField(
        "Password", 
        validators=[DataRequired(), Length(min=6, max=20)]
    )
    
    submit = SubmitField("Login")
    
###Chat form?