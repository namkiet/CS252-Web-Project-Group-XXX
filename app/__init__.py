from flask import Flask
from flask_cors import CORS

from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(config_class)
    
    # db.init_app(app)
    # migrate.init_app(app, db)
    # jwt.init_app(app)
    # oauth.init_app(app)
    
    # from . import extensions
    # extensions.google = oauth.register(
    #     name="google",
    #     client_id=app.config["GOOGLE_CLIENT_ID"],
    #     client_secret=app.config["GOOGLE_CLIENT_SECRET"],
    #     access_token_url="https://oauth2.googleapis.com/token",
    #     authorize_url="https://accounts.google.com/o/oauth2/auth",
    #     client_kwargs={"scope": "openid email profile"},
    # )
    
    from .home import bp as home_bp
    app.register_blueprint(home_bp)

    from .food import bp as food_bp
    app.register_blueprint(food_bp)
    
    
    from .blueprints import auth_bp
    from .blueprints import chat_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)

    return app
