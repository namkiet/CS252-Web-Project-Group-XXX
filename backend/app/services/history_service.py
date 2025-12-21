from app.services.supa_client import get_auth_db

class ChatHistoryService:
    
    def create_session(self, user_id, title=None, first_message=None):
        # title = AI.sumarize(first_message)
        supabase = get_auth_db()
        if title:
            final_title = title
        elif first_message:
            final_title = first_message[:30] + "..." if len(first_message) > 30 else first_message
        else:
            final_title = "New Conversation"

        data = {
            "user_id" : user_id,
            "title" : final_title
        }
        response = supabase.table('chat_sessions').insert(data).execute()
        
        return response.data[0]
    
    def add_message(self, session_id, role : str, user_message : str, 
                    widget_type = 'chat', widget_payload = None, schedule = None):
        import html
        user_message = html.escape(user_message)

        supabase = get_auth_db()
        
        # Build widget object
        widget = {
            "type": widget_type,
            "payload": widget_payload
        }
        
        message_data = {
            "session_id" : session_id,
            "role" : role,
            "content" : user_message,
            "widget" : widget,
            "schedule": schedule,
            # Ensure legacy metadata column is explicitly null when unused
            "metadata": None
        }
        
        supabase.table('chat_messages').insert(message_data).execute()
        return
    
    # for sidebar history
    def get_user_sessions(self, user_id):
        try: 
            supabase = get_auth_db()
            response = (
                supabase.table('chat_sessions')
                .select('*')
                .eq('user_id', user_id)
                .order('is_pinned', desc=True)
                .order('created_at', desc = True)
                .execute()
            )
            
            return response.data
        except Exception as e:
            print(f"error getting user sessions: {e}")
            raise e
    
    # get messages
    def get_history(self, session_id, limit=10, offset=0):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('chat_messages')
                .select('*')
                .eq('session_id', session_id)
                .order('created_at', desc = True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            
            return response.data
        except Exception as e:
            print(f"error getting history: {e}")
            raise e
        
    def get_user_profile(self, user_id):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('users')
                .select('*')
                .eq('id', user_id)
                .single()
                .execute()
            )
            
            return response.data
        except Exception as e:
            print(f"error getting user profile: {e}")
            raise e
    
    # delete sessions
    def delete_session(self, user_id, session_id):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('chat_sessions')
                .delete()
                .eq('id', session_id)
                .eq('user_id', user_id)
                .execute()
            )

            if response.data and len(response.data) > 0:
                return True
            return False
        except Exception as e:
            print(f"error deleting session: {e}")
            raise e
        
    def update_session(self, user_id, session_id, updates):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('chat_sessions')
                .update(updates)
                .eq('id', session_id)
                .eq('user_id', user_id)
                .execute()
            )
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
            
        except Exception as e:
            print(f"error updating session: {e}")
            raise e
        
    def update_session_schedule(self, user_id, session_id, new_schedule):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('chat_sessions')
                .update({'schedule': new_schedule})
                .eq('id', session_id)
                .eq('user_id', user_id)
                .execute()
            )
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
            
        except Exception as e:
            print(f"error updating session schedule: {e}")
            raise e
    
    def get_session_schedule(self, user_id, session_id):
        try:
            supabase = get_auth_db()
            response = (
                supabase.table('chat_sessions')
                .select('schedule')
                .eq('id', session_id)
                .eq('user_id', user_id)
                .single()
                .execute()
            )
            
            if response.data:
                return response.data.get('schedule')
            return None
            
        except Exception as e:
            print(f"error getting session schedule: {e}")
            raise e