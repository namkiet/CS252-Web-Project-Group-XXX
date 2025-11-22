from flask import jsonify, request
from functools import wraps

from app.services.supa_client import get_db

supabase = get_db()

def token_required(f):
    @wraps(f)
    def decorate(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            user_response = supabase.auth.get_user(token)
            current_user = user_response.user
            request.current_user = current_user
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired!', 'error': str(e)}), 401
        
        return f(*args, **kwargs)
    return decorate