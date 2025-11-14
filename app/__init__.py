import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()

load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY")

def create_app():
    app = Flask(__name__)
    CORS(app)
    # app.secret_key = 'keyff'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./DB.db'
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config.setdefault("ENV", "development") 
    app.config.setdefault("DEBUG", True)
    
    
    from .home import bp as home_bp
    app.register_blueprint(home_bp)

    from .food import bp as food_bp
    app.register_blueprint(food_bp)
    
    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp)


    db.init_app(app)
    migrate = Migrate(app, db)

    @app.route('/base')
    def base():
        return render_template('base.html')

    return app

# e3c54974636c6da3457d5d4c