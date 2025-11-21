import os
from supabase import create_client, Client
from config import Config

url: str = Config.SUPABASE_URL
key: str = Config.SUPABASE_KEY

supabase: Client = create_client(url, key)

def get_db():
    return supabase