from flask import Flask, request, jsonify, url_for, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .Blueprints import register_blueprints
from flask_assets import Environment


db = SQLAlchemy()

def create_app():
    app = Flask(
        __name__,
        template_folder = "../frontend",
        static_folder = "../frontend"
    )
    
    CORS(app)
    
    ## sqlite db for testing
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./DB.db'
    
    app.config.setdefault("ENV", "development") 
    app.config.setdefault("DEBUG", True)

    
    # app.config.from_object("config.Config")
    from .models import User, Food
    from . import register_blueprints
    # from .Blueprints.food import food
    from .extension import compile_static_assets
    from .routes import register_routes
            
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # app.register_blueprint(food)
    register_blueprints(app)
    register_routes(app, db)
    
    assets = Environment()
    assets.init_app(app)
    compile_static_assets(app, assets)
    
    return app
    