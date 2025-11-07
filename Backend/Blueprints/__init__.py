import importlib
import pkgutil
from flask import Blueprint

def register_blueprints(app):
    package_name = __name__
    package_path = __path__

    for _, module_name, _ in pkgutil.iter_modules(package_path):
        module = importlib.import_module(f"{package_name}.{module_name}")
        for item_name in dir(module):
            item = getattr(module, item_name)
            if isinstance(item, Blueprint):
                app.register_blueprint(item)
                print(f"Registered blueprint: {item.name}")