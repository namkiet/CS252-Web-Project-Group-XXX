export interface User {
  id: string;
  email: string;
  full_name?: string;
}

const API_URL = '/api/history';

export const hisService = {
  addSession: async (title?: string, firstMessage?: string) => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, first_message: firstMessage })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Create session failed');
      }

      sessionStorage.removeItem('historySessions');
      return data;
    } catch (error) {
      console.error('Error when calling API addSession:', error);
      return null;
    }
  },
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
          // console.log('[sidebarHistory] Loaded sessions:', data);
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
        // console.log(`[chatHistory] Loaded messages for session ${session_id}:`, data.messages);
        sessionStorage.setItem(`chatHistory_${session_id}`, JSON.stringify(data));
      }

      return data;

    } catch (error) {
      console.error("Error when calling API chatHistory:", error);
      throw error;
    }
  },

  getSessionSchedule: async (session_id: string) => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/${session_id}/schedule`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch session schedule');
      }

      if (data.status === "success") {
        // console.log(`[getSessionSchedule] Loaded schedule for session ${session_id}:`, data.schedule);
        sessionStorage.setItem(`sessionSchedule_${session_id}`, JSON.stringify(data.schedule));
        return data.schedule;
      }

      return null;

    } catch (error) {
      console.error("Error when calling API getSessionSchedule:", error);
      return null;
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
  },

  renameSession: async (session_id: string, new_title: string) => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/${session_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: new_title })
      });

      if (response.ok) {
        sessionStorage.removeItem('historySessions');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error when calling API renameSession:", error);
      return false;
    }
  },

  updateSchedule: async (session_id: string, schedule: any) => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/${session_id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ schedule: schedule })
      });

      if (response.ok) {
        // const data = await response.json();
        sessionStorage.removeItem('historySessions');
        return true;
      } else {
        const data = await response.json();
        console.error("Update schedule failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error when calling API updateSchedule:", error);
      return false;
    }
  }
};

