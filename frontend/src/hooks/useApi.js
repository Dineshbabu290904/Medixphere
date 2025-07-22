import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * A custom hook to handle API requests, loading states, and errors.
 * @param {Function} apiFunc - The API function to be called (e.g., apiService.getPatients).
 * @returns {Object} - An object containing data, error, loading state, and the request function.
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      // Toast notifications are handled by the global apiService interceptor
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, error, loading, request };
};

export default useApi;