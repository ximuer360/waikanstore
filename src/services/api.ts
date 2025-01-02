const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = {
  getAllMagazines: async () => {
    try {
      console.log('Fetching magazines from:', `${API_URL}/magazines`);
      const response = await fetch(`${API_URL}/magazines`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received magazines:', data);
      return data;
    } catch (error) {
      console.error('Error fetching magazines:', error);
      return [];
    }
  },

  addMagazine: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_URL}/magazines`, {
        method: 'POST',
        body: formData,
        credentials: 'omit' // 不发送 cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add magazine');
      }

      return response.json();
    } catch (error) {
      console.error('Error adding magazine:', error);
      throw error;
    }
  },

  getMagazineById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/magazines/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching magazine:', error);
      throw error;
    }
  },

  updateMagazine: async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${API_URL}/magazines/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'omit'
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update magazine');
      }

      return data.magazine;
    } catch (error) {
      console.error('Error updating magazine:', error);
      throw error;
    }
  },

  deleteMagazine: async (id: string) => {
    try {
      console.log('Sending delete request for magazine:', id);
      const response = await fetch(`${API_URL}/magazines/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to delete magazine');
      }

      return data;
    } catch (error) {
      console.error('Error deleting magazine:', error);
      throw error;
    }
  }
}; 