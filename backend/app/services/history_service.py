from app.services.supa_client import get_db

class ChatHistoryService:
    
    def __init__(self):
        self.supabase = get_db()
    
    def create_session(self, user_id, first_message):
        # title = AI.sumarize(first_message)
        title = first_message[:20] + "..." if len(first_message) > 20 else first_message 
        data = {
            "user_id" : user_id,
            "title" : title
        }
        response = self.supabase.table('chat_sessions').insert(data).execute()
        
        return response.data[0]
    
    def add_message(self, session_id, role : str, user_message : str, 
                    type = 'chat', data = None, metadata = None):
        data = {
            "session_id" : session_id,
            "role" : role,
            "content" : user_message,
            "metadata" : {
                "type" : type,
                "data" : data,
                "info" : metadata
            }
        }
        
        self.supabase.table('chat_messages').insert(data).execute()
        return 
    
    # for sidebar history
    def get_user_sessions(self, user_id):
        try: 
            response = (
                self.supabase.table('chat_sessions')
                .select('*')
                .eq('user_id', user_id)
                .order('created_at', desc = True)
                .execute()
            )
            
            return response.data
        except Exception as e:
            print(f"error getting user sessions: {e}")
            raise e
    
    # get messages
    def get_history(self, session_id, limit = 10):
        try:
            response = (
                self.supabase.table('chat_messages')
                .select('*')
                .eq('session_id', session_id)
                .order('created_at', desc = False)
                .limit(limit)
                .execute()
            )
            
            return response.data
        except Exception as e:
            print(f"error getting history: {e}")
            raise e