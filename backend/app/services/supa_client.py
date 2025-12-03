import os
from flask import g, request
from supabase import create_client, Client
from app.config import Config

url: str = Config.SUPABASE_URL
key1: str = Config.SUPABASE_SECRET_KEY
key2: str = Config.SUPABASE_KEY

def get_db() -> Client:
    return create_client(url, key2)

def get_auth_db() -> Client:
    if 'auth_db' not in g:
        client = create_client(url, key2)
        
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            try:
                client.auth.set_session(access_token=token, refresh_token="")
            except Exception as e:
                print("Error setting session:", e)

        g.auth_db = client
    return g.auth_db

    
def get_admin_db() -> Client:
    return create_client(url, key1)