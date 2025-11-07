from flask import Flask
from flask_assets import Environment, Bundle

##########
########## 
def compile_static_assets(app : Flask, assets : Bundle):

    css_bundle = Bundle(
        "css/*.css",
        filters="cssmin",
        output="dist/css/style.min.css"
    )
    js_bundle = Bundle(
        "js/*.js",
        filters="rjsmin",
        output="dist/js/script.min.js"
    )

    assets.register("main_css", css_bundle)
    assets.register("main_js", js_bundle)
