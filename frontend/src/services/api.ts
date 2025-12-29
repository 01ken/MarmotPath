import axios from 'axios';
import type { Career, OptimizationResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const careerApi = {
  getCareers: async (): Promise<Career[]> => {
    const response = await apiClient.get<{ careers: Career[] }>('/careers');
    return response.data.careers;
  },
};

export const optimizationApi = {
  optimize: async (
    careerName: string,
    numReads: number = 10
  ): Promise<OptimizationResult> => {
    const response = await apiClient.post<OptimizationResult>('/optimize', {
      career_name: careerName,
      num_reads: numReads,
    });
    return response.data;
  },
};
