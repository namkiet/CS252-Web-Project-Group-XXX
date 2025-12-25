import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    SUPABASE_SECRET_KEY = os.environ.get('SUPABASE_SECRET_KEY')
    
    SECRET_KEY = os.environ.get('SECRET_KEY')

    