import { Magazine } from '../types/magazine';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = {
  getAllMagazines: async (): Promise<Magazine[]> => {
    try {
      const response = await fetch(`${API_URL}/magazines`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching magazines:', error);
      return [];
    }
  },

  addMagazine: async (formData: FormData): Promise<Magazine> => {
    try {
      const response = await fetch(`${API_URL}/magazines`, {
        method: 'POST',
        body: formData
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

  updateMagazine: async (id: string, formData: FormData): Promise<Magazine> => {
    try {
      const response = await fetch(`${API_URL}/magazines/${id}`, {
        method: 'PUT',
        body: formData
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

  deleteMagazine: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/magazines/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to delete magazine');
      }
    } catch (error) {
      console.error('Error deleting magazine:', error);
      throw error;
    }
  }
}; 