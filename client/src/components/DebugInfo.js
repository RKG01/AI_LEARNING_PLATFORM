import React from 'react';

const DebugInfo = () => {
  const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  let apiBaseUrl = rawApiUrl.replace(/\/+$/, '');
  
  if (!apiBaseUrl.endsWith('/api')) {
    apiBaseUrl = apiBaseUrl + '/api';
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 Debug Info</h4>
      <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
      <p><strong>Raw REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL || 'undefined'}</p>
      <p><strong>Final API_BASE_URL:</strong> {apiBaseUrl}</p>
      <p><strong>Test URL:</strong> {apiBaseUrl}/auth/login</p>
    </div>
  );
};

export default DebugInfo;