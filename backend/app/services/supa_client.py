import os
from supabase import create_client, Client, ClientOptions
from app.config import Config

url: str = Config.SUPABASE_URL
key: str = Config.SUPABASE_KEY

admin_options = ClientOptions(
    persist_session=False, 
    auto_refresh_token=False
)

supabase_admin: Client = create_client(url, key, options=admin_options)

auth_options = ClientOptions(
    persist_session=False,
    auto_refresh_token=False
)
supabase_auth: Client = create_client(url, key, options=auth_options)

def get_db():
    return supabase_admin

def get_auth_client():
    return supabase_auth