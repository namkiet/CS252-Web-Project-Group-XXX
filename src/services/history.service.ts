
export interface User {
  id: string;
  email: string;
  full_name?: string;
}


// interface ErrorResponse {
//   error: string;
// }



const API_URL = '/api/history';

export const hisService = {
  // sidebarHistory
  sidebarHistory: async () => {
    const token = localStorage.getItem('token');

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
        // console.log("SidebarHistory API Response:", data);
        if (!response.ok) {
        throw new Error(data.error || 'Sessions failed');
        }

        if (data.status === "success") {

          localStorage.setItem('historySessions', JSON.stringify(data));

        }

        return data;

    } catch (error) {
        console.error("Error when call API sessions:", error);
    }
  },

  chatHistory: async (session_id : string) => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/${session_id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      // console.log(`ChatHistory API Response (session ${session_id}):`, data); // 

      if (!response.ok) {
        throw new Error(data.error || 'Chat history of Sessions failed');
      }

      if (data.status === "success") {
      localStorage.setItem(`chatHistory_${session_id}`, JSON.stringify(data));
      }

      return data;

    } catch (error) {
      console.error("Error when calling API chatHistory:", error);
    }
  } 
};

