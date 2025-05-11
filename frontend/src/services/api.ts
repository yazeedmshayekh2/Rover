import axios from 'axios';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: '',  // Empty baseURL since we're using proxy in package.json
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ExtractTextResponse {
  result?: string;
  error?: string;
  success: boolean;
  message?: string;
}

// API functions
export const extractTextFromImage = async (image: File, prompt?: string): Promise<ExtractTextResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    
    if (prompt && prompt.trim()) {
      formData.append('prompt', prompt);
    }
    
    const response = await api.post<{result?: string; error?: string}>('/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.result) {
      return {
        result: response.data.result,
        success: true
      };
    } else {
      return {
        success: false,
        message: response.data.error || 'No text was extracted from the image.'
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.error || 'An error occurred while processing the image.',
      };
    }
    
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
    };
  }
};

export const clearCache = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/clear_cache');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to clear cache. Please try again.',
    };
  }
};

export default api; 