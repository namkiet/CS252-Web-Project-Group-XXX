from flask import Flask, render_template

def create_app():
    app = Flask(__name__)

    from .home import bp as home_bp
    app.register_blueprint(home_bp)

    from .food import bp as food_bp
    app.register_blueprint(food_bp)

    @app.route('/base')
    def base():
        return render_template('base.html')
    
    return app