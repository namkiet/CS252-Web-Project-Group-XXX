const API_URL = '/api/history'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const historyService = {
  getSessions: async () => {
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if(!response.ok) {
        if(response.status === 401) {

        }

        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      return data.data || [];
    } catch(error) {
      console.error("Error getSessions:", error);
      return [];
    }
  },

  getSessionMessages: async (sessionId: string) => {
    try {
      const response = await fetch(`${API_URL}/${sessionId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if(!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      return data.messages || [];
    } catch(error) {
      console.error(`Error getSessionMessages [${sessionId}]:`, error);
      return [];
    }
  }
};