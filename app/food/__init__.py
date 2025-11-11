from flask import Blueprint

bp = Blueprint(
    'food_bp',
    __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/static/FOOD'
)

from . import routes