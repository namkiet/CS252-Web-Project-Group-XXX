import urllib.parse

def encode_name(name):
    return urllib.parse.quote_plus(name)