from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(config_class)
       
    from app.blueprints.auth import auth_bp
    from app.blueprints.chat import chat_bp
    from app.blueprints.history import history_bp
    
    app.register_blueprint(auth_bp, url_prefix = '/api/auth')
    app.register_blueprint(chat_bp, url_prefix = '/api/chat')
    app.register_blueprint(history_bp, url_prefix = '/api/history')
    return app