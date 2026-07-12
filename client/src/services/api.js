const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  async getMessages(room = 'general', limit = 50, before = null) {
    const params = new URLSearchParams({ room, limit });
    if (before) params.append('before', before);
    
    const response = await fetch(`${API_BASE_URL}/api/messages?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  },

  async sendMessage(username, content, room = 'general') {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, content, room }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  async markAsRead(messageId, username) {
    const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }
    
    return response.json();
  }
};
