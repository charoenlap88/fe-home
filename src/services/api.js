const API_BASE_URL = 'http://localhost:3001/api';

// Generic API call function
const apiCall = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// System Information API calls
export const systemAPI = {
  // Get all system information at once
  getAll: () => apiCall('/system/all'),
  
  // Individual system metrics
  getCPU: () => apiCall('/system/cpu'),
  getMemory: () => apiCall('/system/memory'),
  getDisk: () => apiCall('/system/disk'),
  getNetwork: () => apiCall('/system/network'),
  getOS: () => apiCall('/system/os'),
  getProcesses: () => apiCall('/system/processes'),
};

// PM2 API calls
export const pm2API = {
  // Get PM2 process list
  getProcessList: () => apiCall('/pm2/list'),
  
  // Get PM2 logs
  getLogs: (processName = 'all', lines = 50) => {
    if (processName === 'all') {
      return apiCall(`/pm2/logs/all?lines=${lines}`);
    }
    return apiCall(`/pm2/logs/${processName}?lines=${lines}`);
  },
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'),
};

// Helper functions for formatting data
export const formatters = {
  // Format bytes to human readable format
  formatBytes: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Format uptime to human readable format
  formatUptime: (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    return parseFloat(value).toFixed(decimals) + '%';
  }
};