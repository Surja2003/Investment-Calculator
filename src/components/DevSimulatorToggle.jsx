import React, { useState, useEffect } from 'react';
import { 
  Fab, 
  Tooltip, 
  Box 
} from '@mui/material';
import { 
  PhoneAndroid, 
  Close 
} from '@mui/icons-material';
import DeviceSimulator from './DeviceSimulator';

const DevSimulatorToggle = ({ children }) => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    const isDevMode = import.meta.env.MODE === 'development' || 
                     window.location.hostname === 'localhost' ||
                     window.location.search.includes('devsim=true');
    setIsDevelopment(isDevMode);
  }, []);

  if (!isDevelopment) {
    return children;
  }

  if (showSimulator) {
    return (
      <DeviceSimulator onClose={() => setShowSimulator(false)}>
        {children}
      </DeviceSimulator>
    );
  }

  return (
    <>
      {children}
      
      {/* Development FAB */}
      <Tooltip title="Open Mobile Simulator" placement="left">
        <Fab 
          size="small"
          color="secondary"
          onClick={() => setShowSimulator(true)}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            zIndex: 1300,
            bgcolor: '#ff6b35',
            '&:hover': {
              bgcolor: '#e55a2b'
            }
          }}
        >
          <PhoneAndroid />
        </Fab>
      </Tooltip>
    </>
  );
};

export default DevSimulatorToggle;