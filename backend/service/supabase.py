import os
from flask import g, request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get('SUPABASE_URL')
key1: str = os.environ.get('SUPABASE_SECRET_KEY')
key2: str = os.environ.get('SUPABASE_KEY')

def get_db() -> Client:
    return create_client(url, key2)
    
def get_admin_db() -> Client:
    return create_client(url, key1)