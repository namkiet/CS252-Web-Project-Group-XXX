from flask import Blueprint, request, jsonify
from app.services.supa_client import get_db
from gotrue.errors import AuthApiError

auth_bp = Blueprint('auth', __name__)
supabase = get_db()

@auth_bp.route('/login', methods = ['POST'])
def login():
    data = request.json()
    
    email = data.get('email')
    password = data.get('password')
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email" : email,
            "password" : password
        })
        
        return jsonify({
            "message" : "Login Successful",
            "access_token" : response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "full_name": response.user.user_metadata.get('full_name')
            }
        }), 200
    except AuthApiError:
        return jsonify({"error" : "Wrong password or email" })
    except Exception as e:
        return jsonify({"error" : str(e)}), 500

@auth_bp.route('/signup', methods = ['POST'])
def signup():
    data = request.json()
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name', '')
    
    try:
        response = supabase.auth.sign_up({
            "email" : email,
            "password" : password,
            "options": {
                "data": {"full_name": full_name}
            }
        })
        
        # if response.user and not response.session:
        #     return jsonify({})
        
        return jsonify({
            "message" : "Signup Successful",
            "user": {"id": response.user.id, "email": response.user.email},
            "token": response.session.access_token
        }), 201
        
    except AuthApiError:
        return jsonify({"error" : "Wrong password or email" })
    except Exception as e:
        return jsonify({"error" : str(e)}), 500

@auth_bp.route('/logout', methods = ['POST'])
def logout():
    token = request.headers.get('Authorization', '').replace('Bearer', '')
    try:
        supabase.auth.sign_out(token)
        return jsonify({"message" : "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error" : str(e)}), 500

