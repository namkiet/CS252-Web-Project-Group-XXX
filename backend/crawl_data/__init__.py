from flask import Flask
from flask_cors import CORS

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    
    from crawl_data.route import crawl_bp
    app.register_blueprint(crawl_bp)
    return app