export interface User {
  id: string;
  email: string;
  full_name?: string;
}

const API_URL = '/api/history';

export const hisService = {
  sidebarHistory: async () => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/sessions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        });

        const data = await response.json();
        if (!response.ok) {
        throw new Error(data.error || 'Sessions failed');
        }

        if (data.status === "success") {
          sessionStorage.setItem('historySessions', JSON.stringify(data));
        }

        return data;

    } catch (error) {
        console.error("Error when call API sessions:", error);
    }
  },

  chatHistory: async (session_id : string, limit: number = 20, offset: number = 0) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/${session_id}?limit=${limit}&offset=${offset}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Chat history of Sessions failed');
      }

      if (data.status === "success") {
        sessionStorage.setItem(`chatHistory_${session_id}`, JSON.stringify(data));
      }

      return data;

    } catch (error) {
      console.error("Error when calling API chatHistory:", error);
      throw error;
    }
  },

  deleteSession: async (session_id: string) => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/${session_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        sessionStorage.removeItem(`chatHistory_${session_id}`);
        
        sessionStorage.removeItem('historySessions'); 
        
        return true;
      } else {
        const data = await response.json();
        console.error("Delete failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error when calling API deleteSession:", error);
      return false;
    }
  }
};

