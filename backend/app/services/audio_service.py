import uuid

from app.services.supa_client import get_auth_db
from service.supabase import get_admin_db

class StorageService:
    def __init__(self):
        self.bucket_name = "Voice"
    
    def upload_file(self, file_bytes, path, content_type):
        supabase = get_admin_db()

        supabase.storage.from_(self.bucket_name).upload(
            path,
            file_bytes,
            {"content-type": content_type}
        )

        return path
    
    def get_signed_url(self, path, expires_in=3600):
        supabase = get_auth_db()

        res = supabase.storage.from_(self.bucket_name).create_signed_url(
            path,
            expires_in
        )
        return res.get("signedURL")